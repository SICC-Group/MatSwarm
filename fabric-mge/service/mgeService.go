package service

import (
	"encoding/hex"
	"encoding/json"
	"fabric-mge/tooler"
	"fmt"
	"strings"
	"time"

	"github.com/hyperledger/fabric-config/protolator"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/ledger"
)

type LoginEvent struct {
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Status    string    `json:"status"`
	LoginTime time.Time `json:"logintime"`
}

func (t *ServiceSetup) SaveMgeData(data MetaData) (string, error) {
	eventID := "SaveMgeData"
	reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	defer t.Client.UnregisterChaincodeEvent(reg)

	b, err := json.Marshal(data)
	if err != nil {
		return "", fmt.Errorf("指定的mgeData对象序列化时发生错误")
	}
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "addData", Args: [][]byte{b, []byte(eventID)}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "", err
	}

	err = eventResult(notifier, eventID)
	if err != nil {
		return "", err
	}
	return string(response.TransactionID), nil
}

func (t *ServiceSetup) Noop() (string, error) {
	//事件注册会报错,把事件注册取消了试一下
	//eventID := "PreSaveMgeData"
	//reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	//defer t.Client.UnregisterChaincodeEvent(reg)
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "addData", Args: [][]byte{}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "", err
	}
	// err = eventResult(notifier, eventID)
	// if err != nil {
	// 	return "", err
	// }
	return string(response.TransactionID), nil
}

func (t *ServiceSetup) Test(data []byte) (string, error) {
	//事件注册会报错,把事件注册取消了试一下
	//eventID := "PreSaveMgeData"
	//reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	//defer t.Client.UnregisterChaincodeEvent(reg)
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "addData", Args: [][]byte{data}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "", err
	}
	// err = eventResult(notifier, eventID)
	// if err != nil {
	// 	return "", err
	// }
	return string(response.Payload), nil
}

var LedgerClient *ledger.Client

func Test() {
	LedgerClient, _ = ledger.New(ClientChannelContext)
	info, err := LedgerClient.QueryInfo()
	if err != nil {
		fmt.Println(err)
		fmt.Printf("查询区块链概况: %v\n\n", err)
		return
	}
	//fmt.Printf("区块高度:\n%v\n", info.BCI.Height)
	//fmt.Printf("当前区块Hash:\n%v\n", hex.EncodeToString(info.BCI.CurrentBlockHash))
	//fmt.Printf("前一区块Hash:\n%v\n", hex.EncodeToString(info.BCI.PreviousBlockHash))
	// -------------------- 第1种方式： 根据哈希查询区块 ----------------
	block, err := LedgerClient.QueryBlockByHash(info.BCI.CurrentBlockHash)
	if err != nil {
		fmt.Printf("查询区块信息失败: %v\n", err)
		return
	}
	var sb strings.Builder
	err = protolator.DeepMarshalJSON(&sb, block)
	if err != nil {
		fmt.Println(sb)
	}
	fmt.Printf("区块编号: %v\n", block.Header.Number)
	//fmt.Println(sb.String())
	fmt.Printf("区块Hash:\n%v\n", hex.EncodeToString(block.Header.DataHash))
	blockRes, err := tooler.QueryBlockByBlockNumber(LedgerClient, int64(block.Header.Number))
	txList := blockRes.TransactionList
	for i := 0; i < len(txList); i++ {
		actionList := txList[i].TransactionActionList
		for j := 0; j < len(actionList); j++ {
			//writeSet := actionList[j].WriteSetList
		}
	}
	blockRes, err = tooler.QueryBlockByBlockNumber(LedgerClient, int64(block.Header.Number-1))
	txList = blockRes.TransactionList
	for i := 0; i < len(txList); i++ {
		actionList := txList[i].TransactionActionList
		for j := 0; j < len(actionList); j++ {
			writeSetList := actionList[j].WriteSetList
			for k := 0; j < len(writeSetList); k++ {
				var writeSet WriteSet
				err = json.Unmarshal([]byte(writeSetList[k]), &writeSet)
				fmt.Println(writeSet)
				var value MetaOfAddData
				err = json.Unmarshal([]byte(writeSet.Value), &value)
				fmt.Println(value)
			}
		}
	}
	// -------------------- 第2种方式： 根据块号查询区块 ----------------
	//blockNumber := info.BCI.Height - 1
	//block, err = LedgerClient.QueryBlock(blockNumber)
	//
	//fmt.Printf("区块编号: %v\n", block.Header.Number)
	//fmt.Printf("区块Hash:\n%v\n", hex.EncodeToString(block.Header.DataHash))
	//
	//cfg, err := LedgerClient.QueryConfig()
	//fmt.Printf("通道名称: %v\n", cfg.ID())
	//fmt.Printf("区块个数: %v\n", cfg.BlockNumber())
	//fmt.Printf("锚节点:\n  主机:%v\n  端口:%v\n  机构:%v\n", cfg.AnchorPeers()[0].Host, cfg.AnchorPeers()[0].Port, cfg.AnchorPeers()[0].Org)
}

func (t *ServiceSetup) SaveMgeTemplate(data_ []byte) ([]byte, error) {
	eventID := "SaveMgeTemplate"
	reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	defer t.Client.UnregisterChaincodeEvent(reg)
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "addTemplate", Args: [][]byte{data_, []byte(eventID)}}
	response, err := t.Client.Execute(req)
	if err != nil {
		fmt.Println("err!")
		fmt.Println(err)
		return []byte(""), err
	}
	err = eventResult(notifier, eventID)
	if err != nil {
		fmt.Println("event err!")
		fmt.Println(err)
		return []byte(""), err
	}
	return response.Payload, nil
}

func (t *ServiceSetup) QueryMgeData(data_ []byte) (string, error, []byte) {
	// eventID := "QueryMgeData"
	// reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	// defer t.Client.UnregisterChaincodeEvent(reg)
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "QueryMgeData", Args: [][]byte{data_}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "---", err, nil
	}
	// err = eventResult(notifier, eventID)
	// if err != nil {
	// 	return "-++++", err
	// }
	fmt.Println("获取vo的service")
	fmt.Println(response.Payload)
	fmt.Println(string(response.Payload))
	return string(response.TransactionID), nil, response.Payload
}

func (t *ServiceSetup) FindMgeData(dataID []byte) (string, error) {
	//事件回调删除
	// eventID := "FindMgeData"
	// reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	// defer t.Client.UnregisterChaincodeEvent(reg)
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "findMgeData", Args: [][]byte{dataID}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "", err
	}
	// err = eventResult(notifier, eventID)
	// if err != nil {
	// 	return "", err
	// }
	return string(response.TransactionID), nil
}

func (t *ServiceSetup) FindLogData(dataID []byte) (string, error) {
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "QueryLogData", Args: [][]byte{dataID}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "", err
	}
	return string(response.TransactionID), nil
}

func (t *ServiceSetup) FinishAddData(data []byte, dataByte []byte, dataId string) (string, error) {
	// 事件注册事件先删除。
	// eventID := "FinishAddData"
	// reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	// defer t.Client.UnregisterChaincodeEvent(reg)
	// req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "FinishAddData", Args: [][]byte{data, []byte(eventID)}}
	req := channel.Request{ChaincodeID: t.ChaincodeID, Fcn: "FinishAddData", Args: [][]byte{data}}
	response, err := t.Client.Execute(req)
	if err != nil {
		return "", err
	}
	// err = eventResult_data(notifier, eventID, dataId)
	// if err != nil {
	// 	return "", err
	// }
	return string(response.TransactionID), nil
}

//用户登录
func (t *ServiceSetup) LoginUserEvent(loginEvent LoginEvent) ([]byte, error) {
	eventID := "LoginUserEvent"
	reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	defer t.Client.UnregisterChaincodeEvent(reg)

	loginEventBytes, err := json.Marshal(loginEvent)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal login event: %v", err)
	}

	// 构造链码请求
	req := channel.Request{
		ChaincodeID: t.ChaincodeID,
		Fcn:         "LoginUserEvent",
		Args:        [][]byte{loginEventBytes},
	}

	// 执行链码请求
	response, err := t.Client.Execute(req)
	if err != nil {
		return nil, err
	}

	// 等待并处理事件结果
	err = eventResult(notifier, eventID)
	if err != nil {
		return nil, err
	}

	return response.Payload, nil
}

//开始训练
func (t *ServiceSetup) FCtrain (data map[int][]float64) ([]byte, error) {
	eventID := "FCtrain"
	reg, notifier := regitserEvent(t.Client, t.ChaincodeID, eventID)
	defer t.Client.UnregisterChaincodeEvent(reg)

	loginEventBytes, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal login event: %v", err)
	}

	// 构造链码请求
	req := channel.Request{
		ChaincodeID: t.ChaincodeID,
		Fcn:         "FCtrain",
		Args:        [][]byte{loginEventBytes},
	}

	// 执行链码请求
	response, err := t.Client.Execute(req)
	fmt.Println(err)
	if err != nil {
		return nil, err
	}

	// 等待并处理事件结果
	err = eventResult(notifier, eventID)
	if err != nil {
		return nil, err
	}

	return response.Payload, nil
}
