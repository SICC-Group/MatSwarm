package controller

import (
	"crypto/sha256"
	"encoding/asn1"
	"encoding/hex"
	"encoding/json"
	"fabric-mge/service"
	"fabric-mge/tooler"
	"fabric-mge/web/db"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/trie"
	"github.com/hyperledger/fabric-protos-go/common"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/ledger"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/fab"
)

//更新MPT树
func UpdateMpt(mpt *trie.Trie, title string, addr string, divide []string) {
	LedgerClient, _ := ledger.New(service.ClientChannelContext)
	Nc := make(chan *common.Block)
	//这里面是通过不断的for循环进行 通过交易id查找区块
	//由于交易id和区块出现时间不一致性，所以需要延时查找
	go func() {
		var cnt int
		for {
			fmt.Println("cnt:", cnt)
			if info, err := LedgerClient.QueryBlockByTxID(fab.TransactionID(addr)); err == nil && info != nil {
				fmt.Println("jinlaile")
				Nc <- info
				break
			} else {
				if cnt > 20 {
					//查找次数过多可能有问题。。。
					panic(" ")
				}
				time.Sleep(100 * time.Millisecond)
				cnt++
			}
		}
	}()
	block := <-Nc

	//单纯测试用
	res, _ := LedgerClient.QueryInfo()
	fmt.Println("当前区块哈希", hex.EncodeToString(res.BCI.CurrentBlockHash))

	bh := BlockHash{
		Number:       int64(block.Header.Number),
		PreviousHash: block.Header.PreviousHash,
		DataHash:     block.Header.DataHash,
	}

	//序列化成asn1格式
	m, err := asn1.Marshal(bh)
	if err != nil {
		return
	}
	//进行哈希运算
	hash256 := sha256.New()
	hash256.Write(m)
	blockhash := hex.EncodeToString(hash256.Sum(nil))
	fmt.Println("计算之后的哈希", blockhash)
	//更新MPT树
	var updateMpt DataOfUpdateMPT
	updateMpt.Title = title
	updateMpt.BlockHash = blockhash
	n1, _ := json.Marshal(updateMpt)
	// //不知道有没有并发问题，万一有，还要维护一个锁
	fmt.Println(divide)
	for _, v := range divide {
		if value := mpt.Get([]byte(v)); value == nil {
			mpt.Update([]byte(v), n1)
		} else {
			value = []byte(string(value) + "/div/" + string(n1))
			mpt.Update([]byte(v), value)
		}
	}
	// fmt.Println(string(mpt.Get([]byte("test"))))

	// 老版（接口更新MPT）
	// dataByte, _ := json.Marshal(updateMpt)
	// request, err := http.NewRequest("POST", "http://localhost:8000/api/v2/mpt/update", bytes.NewReader(dataByte))
	// if err != nil {
	// 	fmt.Println("http error")
	// }
	// _, err = http.DefaultClient.Do(request)
	// if err != nil {
	// 	panic(err)
	// }
}

//从MPT树获取数据
func GetDataFromMpt(mpt *trie.Trie, text string) []DataOfUpdateMPT {
	var addrList []DataOfUpdateMPT
	resStr := string(mpt.Get([]byte(text)))
	res := strings.Split(resStr, "/div/")
	fmt.Println(res)
	for _, v := range res {
		var temp DataOfUpdateMPT
		json.Unmarshal([]byte(v), &temp)
		addrList = append(addrList, temp)
	}
	return addrList
}

// string转int
func StringToInt(origin string) int {
	int, _ := strconv.Atoi(origin)
	return int
}

func GetSummary(categories []db.Categories, data MetaOfAddData, Qid string) []db.Categories {
	for i := 0; i < len(categories); i++ {
		category := categories[i]
		if data.Meta.CategoryName == category.Name {
			if len(category.Templates) != 0 {
				for j := 0; j < len(category.Templates); j++ {
					temp := category.Templates[j]
					if temp.Name == data.Meta.Template.Title {
						categories[i].CountAtLeast = category.CountAtLeast + 1
						categories[i].Templates[j].CountAtLeast = temp.CountAtLeast + 1
						return categories
					}
				}
				tempForTemplate := db.Categories{
					CountAtLeast: 1,
					Id:           StringToInt(data.Meta.Template.Id),
					Name:         data.Meta.Template.Title,
					Download:     false,
					Url:          "/api/v2/search/query/" + Qid + "/" + data.Meta.Template.Id,
				}
				category.Templates = append(category.Templates, tempForTemplate)
				return categories
			}
		}
	}
	tempForTemplate := db.Categories{
		CountAtLeast: 1,
		Id:           StringToInt(data.Meta.Template.Id),
		Name:         data.Meta.Template.Title,
		Download:     false,
		Url:          "/api/v2/search/query/" + Qid + "/" + data.Meta.Template.Id,
	}
	var temArr []db.Categories
	temArr = append(temArr, tempForTemplate)
	tempForCategory := db.Categories{
		CountAtLeast: 1,
		Id:           data.Meta.Category,
		Name:         data.Meta.CategoryName,
		Templates:    temArr,
	}
	categories = append(categories, tempForCategory)
	return categories
}

//该函数为从fabric自带的函数接口中从区块地址解析读写集
func GetDataFromAddr(data []DataOfUpdateMPT, Qid string, tId string) ([]db.DataOfCategoryRes, db.Summary) {
	LedgerClient, _ := ledger.New(service.ClientChannelContext)
	var dataList []db.DataOfCategoryRes
	var summary db.Summary

	//由于一个区块中会有多个交易，需要用哈希表去重
	set := map[string]struct{}{}
	for i := 0; i < len(data); i++ {
		if _, ok := set[data[i].BlockHash]; !ok {
			set[data[i].BlockHash] = struct{}{}
		}
	}

	for k := range set {
		addr, _ := hex.DecodeString(k) // get block
		block, err := LedgerClient.QueryBlockByHash(addr)
		if err != nil {
			fmt.Printf("addr:%x,找不到对应的区块", addr)
		}
		blockRes, err := tooler.QueryBlockByHash(block)
		txList := blockRes.TransactionList
		if err != nil {
			fmt.Println("err!!!!")
		}
		for i := 0; i < len(txList); i++ {
			actionList := txList[i].TransactionActionList
			for j := 0; j < len(actionList); j++ {
				writeSetList := actionList[j].WriteSetList
				for k := 0; k < len(writeSetList); k++ {
					var writeSet service.WriteSet
					err = json.Unmarshal([]byte(writeSetList[k]), &writeSet)
					var valueOfRes ResOfFinish
					err = json.Unmarshal([]byte(writeSet.Value), &valueOfRes)
					value := valueOfRes.Data
					var dataOfCategory = db.DataOfCategory{
						Abstract:     value.Meta.Abstract,
						AddTime:      value.Meta.AddTime,
						Category:     value.Meta.Category,
						CategoryName: value.Meta.CategoryName,
						Downloads:    0,
						ExternalLink: "",
						Id:           value.Meta.Id,
						Methods:      value.Meta.Source.Methods,
						Project:      value.Meta.OtherInfo.Project,
						Realname:     "",
						Score:        0,
						Source:       value.Meta.Source.Source,
						Subject:      value.Meta.OtherInfo.Subject,
						Template:     value.Meta.Template.Id,
						TemplateName: value.Meta.Template.Title,
						Title:        value.Meta.Title,
						User:         "",
						Views:        0,
					}
					var dataRes = db.DataOfCategoryRes{Download: 0, Score: 0, Data: dataOfCategory}
					if (tId != "" && tId == dataOfCategory.Template) || tId == "" {
						dataList = append(dataList, dataRes)
					}
					summary.Category = GetSummary(summary.Category, value, Qid)
				}
			}
		}
	}
	return dataList, summary
}

// qid不为空，已经创建过检索数据，直接从数据库里拿
func GetQueryDataByQId(qId string, tId string) ([]db.DataOfCategoryRes, db.Summary) {
	var res []db.DataOfCategoryRes
	temp := db.GetQueryDataByID(qId)
	if tId != "" {
		for _, v := range temp.Data {
			if v.Data.Template == tId {
				res = append(res, v)
			}
		}
	}
	return res, temp.Summary
}

func GetMethods(origin string) []string {
	var res []string
	for i := 0; i < len(origin); i++ {
		if i == 0 {
			if origin[i] == '1' {
				res = append(res, "computation")
			}
		} else if i == 1 {
			if origin[i] == '1' {
				res = append(res, "experiment")
			}
		} else if i == 2 {
			if origin[i] == '1' {
				res = append(res, "production")
			}
		} else {
			if origin[i] == '1' {
				res = append(res, "other")
			}
		}
	}
	return res
}

func DataToTable(origin MetaOfAddData) db.DataTable {
	tid := origin.Meta.Tid
	template := db.GetTemplateById(tid)
	res := db.DataTable{
		Title:               origin.Meta.Title,
		Category:            template.Category,
		CategoryId:          template.Category_id,
		Keywords:            strings.Split(origin.Meta.Keywords, ","),
		Methods:             GetMethods(origin.Meta.Source.Methods),
		Abstract:            origin.Meta.Abstract,
		Author:              "",
		Project:             origin.Meta.OtherInfo.Project,
		Subject:             origin.Meta.OtherInfo.Subject,
		Doi:                 origin.Meta.Doi,
		Contributor:         origin.Meta.Contributor,
		Reference:           origin.Meta.Source.Reference,
		UploaderInstitution: origin.Meta.Institution,
		Source:              origin.Meta.Source.Source,
		Content:             origin.Content,
		Template:            template,
	}
	return res
}

func QueryTextToTable(text string) db.QueryTable {
	res := db.QueryTable{
		Value: text,
	}
	return res
}

func QueryToTable(summary_ db.Summary, dataList_ []db.DataOfCategoryRes, text string) db.QueryTable {
	res := db.QueryTable{
		Data:    dataList_,
		Summary: summary_,
		Total:   len(dataList_),
		Value:   text,
	}
	return res
}
