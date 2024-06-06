package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

type ResponseF struct {
	Code int       `json:"code"`
	Msg  string    `json:"msg"`
	Data []float64 `json:"data"`
}

func (t *EducationChaincode) FCtrain(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	fmt.Println("FCtrain called")
	if len(args) != 1 {
		return shim.Error("需要一个参数: FCtrain JSON字符串")
	}

	var data map[int][]float64
	err := json.Unmarshal([]byte(args[0]), &data)
	if err != nil {
		return shim.Error(fmt.Sprintf("解析FCtrain失败: %s", err))
	}

	fmt.Println("data:", data)
	ave, _ := calculateAverage(data)
	fmt.Println("ave:", ave)

	eventPayload, err := json.Marshal(data)
	if err != nil {
		return shim.Error(fmt.Sprintf("序列化LoginEvent失败: %s", err))
	}

	err = stub.SetEvent("FCtrain", eventPayload)
	if err != nil {
		return shim.Error(fmt.Sprintf("设置登录事件失败: %s", err))
	}
	resp := ResponseF{Code: 0, Msg: "登录事件记录成功111", Data: ave}
	respBytes, err := json.Marshal(resp)
	if err != nil {
		return shim.Error(fmt.Sprintf("序列化响应失败: %s", err))
	}
	return shim.Success(respBytes)
}

func calculateAverage(data map[int][]float64) ([]float64, error) {
	if len(data) == 0 {
		return nil, fmt.Errorf("no data provided")
	}

	// 计算聚合值和平均值
	sums := make([]float64, len(data[1])) // 假设至少有一组数据且每组长度相同
	count := 0
	for _, nums := range data {
		count++
		for i, num := range nums {
			sums[i] += num
		}
	}

	averages := make([]float64, len(sums))
	for i, sum := range sums {
		averages[i] = sum / float64(count)
	}

	return averages, nil
}
