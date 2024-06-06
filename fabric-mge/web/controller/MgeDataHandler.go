package controller

import (
	"encoding/json"
	"fabric-mge/web/db"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/ethereum/go-ethereum/trie"
)

// FindMgeDataById 请求格式 dataID = xxx
func (app *Application) FindMgeDataById(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from FindMgeDataById, 处理跨域options请求")
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(r.Body)
	bodyI, _ := ioutil.ReadAll(r.Body)
	id := r.URL.Query().Get("dataID")
	fmt.Println("收到请求查询的数据id:", id)
	msg, err := app.Setup.FindMgeData(bodyI)
	if err != nil {
		fmt.Println("findDataById的链码报错了")
		fmt.Println(err)
		//return
	}
	fmt.Println("findDataById done: " + msg)
	dataTable := db.GetDataById(id)
	template := Template_{
		Id:      dataTable.Template.Id,
		Title:   dataTable.Template.Title,
		Content: dataTable.Template.Content,
	}
	res := MetaData{
		Id:          dataTable.Id.Hex(),
		Title:       dataTable.Title,
		Abstract:    dataTable.Abstract,
		Category:    dataTable.Category,
		CategoryId:  dataTable.CategoryId,
		Source:      dataTable.Source,
		Methods:     dataTable.Methods,
		Keywords:    dataTable.Keywords,
		Template:    template,
		Doi:         dataTable.Doi,
		Author:      dataTable.Author,
		AddTime:     dataTable.AddTime.Format("2006-01-02 15:04:05"),
		Content:     dataTable.Content,
		Reference:   dataTable.Reference,
		Institution: dataTable.UploaderInstitution,
		Contributor: dataTable.Contributor,
		Project:     dataTable.Project,
		Subject:     dataTable.Subject,
		ReviewState: 0,
		PublicDate:  dataTable.PublicDate.Format("2006-01-02 15:04:05"),
		PublicRange: "",
		ProjectName: dataTable.Project,
		SubjectName: dataTable.Subject,
	}
	resByte, _ := json.Marshal(res)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	// 老版
	response, _ := http.Get("http://localhost:8000/api/v2/storage/data/" + id)
	fmt.Println(response)
	// defer func(Body io.ReadCloser) {
	// 	err := Body.Close()
	// 	if err != nil {
	// 		print("ERROR")
	// 		print(err)
	// 		return
	// 	}
	// }(response.Body)
	// var resNew ResWithSign
	// body, _ := ioutil.ReadAll(response.Body)
	// _ = json.Unmarshal(body, &resNew)
	// sign.Verify(resNew.SignText, resNew.PublicKeyUrl, resNew.Sign)
	// w.Header().Set("content-type", "text/json")
	// w.WriteHeader(200)
	// _, err = w.Write(body)
	// if err != nil {
	// 	print("ERROR")
	// 	print(err)
	// 	return
	// }
	w.Write(resByte)
}

var lock sync.Mutex

//这个函数的作用是：上传功能；
//区块链鉴权，直接查询levedb；content哈希处理;区块链更新元数据和success字段；区块链更新success字段
func (app *Application) AddMgeData(w http.ResponseWriter, r *http.Request) {
	t1 := time.Now().UnixNano() / 1e6
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from AddMgeData, 处理跨域options请求")
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(r.Body)
	body, _ := ioutil.ReadAll(r.Body)
	//预添加mge数据，直接发送一笔
	//留一个鉴权的接口,这个是鉴权和预添加
	msg, errPre := app.Setup.Noop()
	if errPre != nil {
		fmt.Println("保存数据的链码报错了")
		fmt.Println(errPre.Error())
		return
	}
	fmt.Println("done: " + msg)

	//鉴权结束，直接返回前端
	rsp := &ResDataIdWithSign{
		Code: 0,
		Data: "", // pending
	}
	if errPre != nil {
		rsp.Code = -1
		rsp.Data = errPre.Error()
	}
	rspByte, err := json.Marshal(rsp)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	w.Write(rspByte)
	if err != nil {
		panic(err)
	}
	if errPre != nil {
		return
	}
	t2 := time.Now().UnixNano() / 1e6
	fmt.Println("timing:", t1, t2, t2-t1)
	//************************************
	//content转发----为区块链server转发字段给python进行读写操作
	//********************************
	// httpReq, err := http.NewRequest("POST", "http://localhost:8000/api/v1.1/storage/data/full", bytes.NewReader(body))
	// var finishRes ResOfFinish
	// var newRes ResDataIdWithSign
	// resp, err := http.DefaultClient.Do(httpReq)
	// if err != nil {
	// 	msg, errOfChain := app.Setup.FinishAddData([]byte{})
	// 	if errOfChain != nil {
	// 		fmt.Println("finishAddData的链码报错了")
	// 		fmt.Println(errOfChain)
	// 		return
	// 	}
	// 	fmt.Println("finishAddData error" + msg)
	// 	return
	// }
	// rspBody, _ := ioutil.ReadAll(resp.Body)
	// _ = json.Unmarshal(rspBody, &newRes)
	// fmt.Println(newRes)
	//--------------上面为区块链转发信息给python端进行数据库读写操作

	//真实content 的哈希上链过程-----上链更改字段和更新MPT转为后台
	var allData MetaOfAddData
	err = json.Unmarshal(body, &allData)
	if err != nil {
		fmt.Println(err)
	}
	//这里是数据库的操作
	lock.Lock()
	dataTable := DataToTable(allData)
	db.AddMgeData(&dataTable)
	//这是一个数据完成入库结束
	allData.Meta.Id = dataTable.Id.Hex()
	//关键词提取，放在了content hash处理之前
	divide := db.SliceKeyWords(allData.Content)
	lock.Unlock()
	//content hash处理
	allData.Content = string(GetHash([]byte(allData.Content)))
	var finishRes ResOfFinish
	// var newRes ResDataIdWithSign
	finishRes.IsSuccess = 1
	finishRes.Data = allData
	finishRes.Data.Meta.Id = allData.Meta.Id
	fmt.Println("*************")
	//MPT树更新，要先更新mpt，mpt上的读写集直接就是ResOfFinish；然后再传递链码
	// divide := []string{}
	// divide = append(divide, "test")
	originDataArr := []ResOfFinish{}
	originDataArr = append(originDataArr, finishRes)
	var categoryTrie *trie.Trie
	for _, v := range divide {
		categoryTrie = UpdateBitMap(v, app.Setup.MptBitMap, app.Setup.MptList,
			dataTable.CategoryId, app.Setup.Mptdb, originDataArr)
	}
	fmt.Println(originDataArr[0])
	chainData := GetUpateVO(categoryTrie, dataTable.CategoryId, originDataArr, divide[len(divide)-1])
	resByte, _ := json.Marshal(chainData)
	var test2 []ResOfFinish
	_ = json.Unmarshal(chainData.OriginDataByte, &test2)
	fmt.Println("-------")
	fmt.Println(test2[0])
	transactionId, err := app.Setup.FinishAddData(resByte, chainData.OriginDataByte, finishRes.Data.Meta.Id)
	if err != nil {
		fmt.Println("finishAddData的链码报错了")
		fmt.Println(err)
		return
	}
	fmt.Println("done: " + transactionId)
	//老版mpt方案
	// UpdateMpt(app.Setup.Mpt, allData.Meta.Title, transactionId, divide)
	//**********************************
	//w.Write(rspBody)

}
