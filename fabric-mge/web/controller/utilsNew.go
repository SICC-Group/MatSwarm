package controller

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fabric-mge/service"
	"fabric-mge/tooler"
	"fabric-mge/web/db"
	"fmt"
	"unsafe"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/ledger"
)

// 上传数据用
func UpdateBitMap(word string, mptBitMap *trie.Trie, mptList map[int]common.Hash,
	categoryId int, mptdb service.MptDB, dataSet []ResOfFinish) *trie.Trie {
	var bSet BitSetStruct
	temp := mptBitMap.Get([]byte(word))
	if temp == nil { // 该分词对应的category bitmap不存在
		fmt.Println("对应的Category bitmap不存在")
		bSetNew := NewBitSetStruct(64)
		bSetNew.Bits.Set(uint64(categoryId))
		bSetNew.Numbers = append(bSetNew.Numbers, categoryId)
		bSetNewByte, _ := json.Marshal(bSetNew)
		CommonUpdateTrie(mptBitMap, word, bSetNewByte, mptdb, "mge-bitmap", true)
	} else { // 该分词对应的category bitmap存在
		fmt.Println("对应的Category bitmap存在")
		err := json.Unmarshal(temp, &bSet)
		if err != nil {
			fmt.Println("反序列化bitmap失败")
			fmt.Println(err)
		}
		if !bSet.Bits.Get(uint64(categoryId)) {
			bSet.Bits.Set(uint64(categoryId))
			bSet.Numbers = append(bSet.Numbers, categoryId)
		}
		bSetByte, _ := json.Marshal(bSet)
		CommonUpdateTrie(mptBitMap, word, bSetByte, mptdb, "mge-bitmap", true)
	}
	// test
	var test BitSetStruct
	bytes := mptBitMap.Get([]byte(word))
	err := json.Unmarshal(bytes, &test)
	if err != nil {
		fmt.Println(err.Error() + "********")
	}
	fmt.Println(test.Numbers)
	// 插入读写集
	data := []ResOfFinish{}
	data = append(data, dataSet...)
	categoryTrie := CheckCategory(categoryId, mptList, mptdb)
	dataOriginByte := categoryTrie.Get([]byte(word))
	if dataOriginByte != nil {
		var dataOrigin []ResOfFinish
		err := json.Unmarshal(dataOriginByte, &dataOrigin)
		if err != nil {
			fmt.Println("解析dataoriginbyte失败")
			fmt.Println(err)
		}
		data = append(data, dataOrigin...)

	}
	dataByte, _ := json.Marshal(data)
	CommonUpdateTrie(categoryTrie, word, dataByte, mptdb, "category"+string(rune(categoryId)),
		true)
	mptList[categoryId] = categoryTrie.Hash()
	return categoryTrie
}

// 通用 在trie中更新数据
func CommonUpdateTrie(commonTrie *trie.Trie, key string, value []byte,
	mptdb service.MptDB, dbKey string, needCommit bool) {
	commonTrie.Update([]byte(key), value) // triedb中也同步更新
	rootHash := commonTrie.Hash()
	mptdb.LevelDB.Put([]byte(dbKey), rootHash[:]) // leveldb中更新根哈希
	if needCommit {                               // 待优化
		hash, nodes := commonTrie.Commit(false)
		if nodes != nil {
			mptdb.TrieDb.Update(trie.NewWithNodeSet(nodes))
		}
		errNew := mptdb.TrieDb.Commit(hash, true)
		if errNew != nil {
			fmt.Println("db的commit报错")
			fmt.Println(errNew)
		}
		// commit之后需要再次new，待确认
		mptdb.TrieDb = trie.NewDatabase(mptdb.LevelDB)
		id := trie.ID{
			Root: common.BytesToHash(rootHash[:]),
		}
		temp, err := trie.New(&id, mptdb.TrieDb)
		if err != nil {
			fmt.Println("从已有hash中重建common mpt错误")
		}
		commonTrie = temp
	}
}

// 获取categoryTrie
func GetCategoryTrie(rootHash common.Hash, mptdb service.MptDB) *trie.Trie {
	id := trie.ID{
		Root: rootHash,
	}
	tempTrie, err := trie.New(&id, mptdb.TrieDb)
	if err != nil {
		fmt.Println("从已有hash中重建category mpt错误")
		fmt.Println(err)
	}
	return tempTrie
}

// 检查categoryId对应trie是否存在，不存在则创建，返回trie
func CheckCategory(categoryId int, mptList map[int]common.Hash, mptdb service.MptDB) *trie.Trie {
	originHash, isExist := mptList[categoryId]
	var tempTrie *trie.Trie
	if !isExist {
		tempTrie = trie.NewEmpty(mptdb.TrieDb)
		rootHash := tempTrie.Hash()
		mptdb.LevelDB.Put([]byte("category"+string(rune(categoryId))), rootHash[:])
	} else {
		return GetCategoryTrie(originHash, mptdb)
	}
	return tempTrie
}

// 检索用，提取读写集并格式转化成datalist summary
func GetRWSetFromCategory(categoryList []int, mptList map[int]common.Hash,
	word string, Qid string, tId string, mptdb service.MptDB) ([]db.DataOfCategoryRes, db.Summary) {
	var summary db.Summary
	var dataList []db.DataOfCategoryRes
	for _, category := range categoryList {
		categoryTrie := GetCategoryTrie(mptList[category], mptdb)
		dataByte := categoryTrie.Get([]byte(word))
		var valueOfResList []ResOfFinish
		err := json.Unmarshal(dataByte, &valueOfResList)
		if err != nil {
			fmt.Println("从mptlist解析data报错")
			fmt.Println(err)
		}
		for _, valueOfRes := range valueOfResList {
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
	return dataList, summary
}

func UnmarshalCategoryIds(origin []byte) []int {
	var bSet BitSetStruct
	err := json.Unmarshal(origin, &bSet)
	if err != nil {
		fmt.Println("解析bitmap失败")
		fmt.Println(err)
		return nil
	}
	fmt.Println("这里是解析Bset")
	fmt.Println(bSet)
	fmt.Println(bSet.Numbers)
	return bSet.Numbers
}

func GetCategoryList(word string, mptBitMap *trie.Trie) []int {
	temp := mptBitMap.Get([]byte(word))
	if temp == nil {
		fmt.Println("categoryList不存在")
	}
	numbers := UnmarshalCategoryIds(temp)
	return numbers
}

// 从区块里提取读写集，上传数据用（老版本）
func GetReadWriteSet(txId string, LedgerClient *ledger.Client) []ResOfFinish {
	txInfo, err := tooler.QueryTransactionByTxId(LedgerClient, txId)
	var res []ResOfFinish
	if err != nil {
		fmt.Println("解析交易报错")
		fmt.Println(err)
	}
	// var writeSet service.WriteSet
	txList := txInfo.TransactionActionList
	for _, tx := range txList {
		writeSetList := tx.WriteSetList
		for _, writeSetInfo := range writeSetList {
			var writeSet service.WriteSet
			err = json.Unmarshal([]byte(writeSetInfo), &writeSet)
			var valueOfRes ResOfFinish
			err = json.Unmarshal([]byte(writeSet.Value), &valueOfRes)
			res = append(res, valueOfRes)
		}
	}
	// err = json.Unmarshal([]byte(txInfo.TransactionActionList[0].WriteSetList[0]), &writeSet)
	return res
}

//上传数据用，获取UpdateVO，包括RootHashNew, dataHash, data
func GetUpateVO(categoryTrie *trie.Trie, categoryId int, originData []ResOfFinish, key string) UpdateVO {
	var updateVO UpdateVO
	originDataByte, err := json.Marshal(originData)
	if err != nil {
		fmt.Println("序列化originData时出错")
		fmt.Println(err)
	}
	Result := GetHash(originDataByte)
	rootHash := categoryTrie.Hash()
	proof := GetProof(key, categoryTrie)
	updateVO = UpdateVO{
		OriginDataByte: originDataByte,
		DataHash:       Result,
		RootHashNew:    rootHash[:],
		Key:            key,
		CategoryId:     categoryId,
		Proof:          proof,
	}
	return updateVO
}

// 检索用，获取发给客户端的VO
func GetClientVO(key string, VOchainMapByte []byte, categoryList []int, mptList map[int]common.Hash, mptdb service.MptDB) ClientVO {
	VOchainMap := make(map[int][]byte)
	res := ClientVO{
		Key: key,
	}
	err := json.Unmarshal(VOchainMapByte, &VOchainMap)
	VOMap := make(map[int]VO)
	if err != nil {
		fmt.Println("反序列化vochainbyte失败")
		fmt.Println(err)
	}
	for _, category := range categoryList {
		categoryTrie := GetCategoryTrie(mptList[category], mptdb)
		proof := GetProof(key, categoryTrie)
		vo := VO{
			VOChain: hex.EncodeToString(VOchainMap[category]),
			Proof:   hex.EncodeToString(proof),
		}
		VOMap[category] = vo
	}
	res.VOMap = VOMap
	return res
}

func GetProof(key string, commonTrie *trie.Trie) []byte {
	// proofdb := memorydb.New()
	proofdb := tooler.NewProofDB()
	err := commonTrie.Prove([]byte(key), 0, proofdb)
	if err != nil {
		fmt.Println("prove失败")
		fmt.Println(err)
	}
	proof, err := json.Marshal(proofdb.KV)
	// _, err = trie.VerifyProof(commonTrie.Hash(), []byte(key), proofdb)
	// if err != nil {
	// 	fmt.Println("provedb失败")
	// 	fmt.Println(err)
	// }
	return proof
}

// 获取hash值
func GetHash(origin []byte) []byte {
	Md5Inst := md5.New()
	Md5Inst.Write(origin)
	Result := Md5Inst.Sum([]byte(""))
	return Result
}

func BytesToString(data []byte) string {
	return *(*string)(unsafe.Pointer(&data))
}

func StringToBytes(data string) []byte {
	return *(*[]byte)(unsafe.Pointer(&data))
}
