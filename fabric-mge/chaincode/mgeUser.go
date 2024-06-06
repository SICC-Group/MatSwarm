package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

type LoginEvent struct {
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Status    string    `json:"status"`
	LoginTime time.Time `json:"logintime"`
}

type Response struct {
    Code int `json:"code"`
	Msg string `json:"msg"`
}

func (t *EducationChaincode) LoginUserEvent(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("需要一个参数: LoginEvent JSON字符串")
	}

	var loginEvent LoginEvent
	err := json.Unmarshal([]byte(args[0]), &loginEvent)
	if err != nil {
		return shim.Error(fmt.Sprintf("解析LoginEvent失败: %s", err))
	}

	eventPayload, err := json.Marshal(loginEvent)
	if err != nil {
		return shim.Error(fmt.Sprintf("序列化LoginEvent失败: %s", err))
	}

	err = stub.SetEvent("LoginUserEvent", eventPayload)
	if err != nil {
		return shim.Error(fmt.Sprintf("设置登录事件失败: %s", err))
	}
	resp := Response{Code: 0, Msg: "登录事件记录成功"}
    respBytes, err := json.Marshal(resp)
	if err != nil {
        return shim.Error(fmt.Sprintf("序列化响应失败: %s", err))
    }
	return shim.Success(respBytes)
}
