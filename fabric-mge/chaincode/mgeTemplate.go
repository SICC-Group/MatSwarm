package main

import (
	"crypto/md5"
	"encoding/json"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

type Res struct {
	Code int `json:"code"`
	Data int `json:"data"`
}

func (t *EducationChaincode) addTemplate(stub shim.ChaincodeStubInterface, args []string) peer.Response { // done
	var template Template
	if len(args) == 0 {
		return shim.Error("参数小于指定数量")
	}
	if len(args[0]) == 0 {
		return shim.Error("参数不合法")
	}
	err := json.Unmarshal([]byte(args[0]), &template)
	if err != nil {
		return shim.Error("!" + err.Error())
	}
	// template content hash处理
	Md5Inst := md5.New()
	Md5Inst.Write([]byte(template.Content))
	Result := Md5Inst.Sum([]byte(""))
	template.Content = string(Result)
	msg, bl := PutMgeTemplate(stub, template.Title, template)
	if !bl {
		return shim.Error(msg)
	}

	err = stub.SetEvent(args[1], []byte{})
	if err != nil {
		return shim.Error(err.Error())
	}
	//return shim.Success([]byte("mge模板添加成功"))
	return shim.Success([]byte("?"))
}

func PutMgeTemplate(stub shim.ChaincodeStubInterface, title string, template Template) (string, bool) {
	b, err := json.Marshal(template)
	if err != nil {
		return err.Error(), false
	}

	// 保存
	err = stub.PutState("template-"+title, b)
	if err != nil {
		return err.Error(), false
	}
	return "none", true
}
