package main

import (
	"bytes"
	"crypto/md5"
	"encoding/json"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

type Template struct {
	Id                  int      `json:"id"`
	Title               string   `json:"title"`
	Category            string   `json:"category"`
	CategoryId          int      `json:"category_id"`
	Author              string   `json:"author"`
	Abstract            string   `json:"abstract"`
	RefCount            int      `json:"ref_count"`
	PubDate             string   `json:"pub_date"`
	Username            string   `json:"username"`
	Published           bool     `json:"published"`
	Content             string   `json:"content"`
	ReviewState         int      `json:"review_state"`      // 审核状态
	DisapproveReason    []string `json:"disapprove_reason"` // 不通过原因
	Version             int      `json:"version"`
	UploaderInstitution string   `json:"uploader_institution"`
	ProjectName         string   `json:"project_name"`
	SubjectName         string   `json:"subject_name"`
	Method              int      `json:"method"`
}

func (t *EducationChaincode) addData(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// err := stub.SetEvent(args[0], []byte{})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	// 用户鉴权
	return shim.Success([]byte("mge数据添加成功"))
}

func (t *EducationChaincode) FinishAddData(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// var mgeData ResOfFinish
	// err := json.Unmarshal([]byte(args[0]), &mgeData)

	var updateVO UpdateVO
	err := json.Unmarshal([]byte(args[0]), &updateVO)
	if err != nil {
		return shim.Error(err.Error())
	}
	verify, _ := VerifyVO(updateVO, stub)
	if verify != "" {
		return shim.Error(verify)
	}
	var originData []ResOfFinish
	err = json.Unmarshal(updateVO.OriginDataByte, &originData)
	if err != nil {
		return shim.Error("反序列化origindata失败" + err.Error())
	}
	// for _, v := range originData {
	// 	msg, bl := PutMgeData(stub, v)
	// 	if !bl {
	// 		return shim.Error(msg)
	// 	}
	// }
	// err = stub.SetEvent(args[1], []byte{})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	return shim.Success(nil)
}

func PutMgeData(stub shim.ChaincodeStubInterface, mgeData ResOfFinish) (string, bool) {
	b, err := json.Marshal(mgeData)
	if err != nil {
		return err.Error(), false
	}

	// 保存
	err = stub.PutState("data-"+mgeData.Data.Meta.Title, b)
	if err != nil {
		return err.Error(), false
	}
	return "none", true
}

//mge
//args: dataID
func (t *EducationChaincode) findMgeData(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	// err := stub.SetEvent(args[1], []byte{})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }

	return shim.Success([]byte("query chaincode success"))
}

func (t *EducationChaincode) QueryMgeData(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	//err := stub.SetEvent(args[1], []byte{})
	// if err != nil {
	// 	return shim.Error(err.Error())
	// }
	var categoryList []int
	err := json.Unmarshal([]byte(args[0]), &categoryList)
	if err != nil {
		// return shim.Error("反序列化categoryList失败" + err.Error())
		return shim.Success([]byte("反序列化categoryList失败" + err.Error()))
	}
	res := make(map[int][]byte)
	for _, v := range categoryList {
		text := "category" + string(rune(v))
		vo, err := stub.GetState(text)
		if err != nil {
			return shim.Error("在链上获取vo失败" + text + err.Error())
		}
		if vo == nil {
			return shim.Success([]byte("获取vo为空"))
		}
		res[v] = vo
	}
	resByte, err := json.Marshal(res)
	if err != nil {
		// return shim.Error("序列化res失败" + err.Error())
		return shim.Success([]byte("序列化res失败" + err.Error()))
	}
	return shim.Success(resByte)
}

func VerifyVO(updateVO UpdateVO, stub shim.ChaincodeStubInterface) (string, []byte) {
	// 第一步，先算dataHash，看与发过来的dataHash是否一致
	Md5Inst := md5.New()
	Md5Inst.Write(updateVO.OriginDataByte)
	Result := Md5Inst.Sum([]byte(""))
	if !bytes.Equal(Result, updateVO.DataHash) {
		return "dataHash不匹配", updateVO.OriginDataByte
	}
	// 第二步算VO是否匹配
	// tempdb := memorydb.New()
	// tempdb.Put(updateVO.RootHashNew, updateVO.Proof)
	tempKV := make(map[string][]byte)
	tempdb := NewProofDB()
	err := json.Unmarshal(updateVO.Proof, &tempKV)
	tempdb.KV = tempKV
	if err != nil {
		return "反序列化proofdb失败" + err.Error(), nil
	}
	value, err := trie.VerifyProof(common.BytesToHash(updateVO.RootHashNew), []byte(updateVO.Key), tempdb)
	if err != nil {
		return "verify错误" + err.Error(), nil
	} else if bytes.Equal(value, []byte(updateVO.Key)) {
		return "不匹配", nil
	}

	// 第三步 保存roothash到链上
	err = stub.PutState("category"+string(rune(updateVO.CategoryId)), updateVO.RootHashNew)
	if err != nil {
		return "保存根hash错误" + err.Error(), nil
	}
	return "", updateVO.RootHashNew
}

//func (t *mgeDataChainCode) Init(stub shim.ChaincodeStubInterface) peer.Response {
//	fmt.Println(" ==== Init ====")
//
//	return shim.Success(nil)
//}
//
//func (t *mgeDataChainCode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
//	fun, args := stub.GetFunctionAndParameters()
//	if fun == "AddData" {
//		return t.AddData(stub, args)
//	}
//	return shim.Error("指定的函数名称错误")
//}
