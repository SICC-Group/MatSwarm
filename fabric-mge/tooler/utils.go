package tooler

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/golang/protobuf/proto"
	"github.com/hyperledger/fabric-protos-go/common"
	"github.com/hyperledger/fabric-protos-go/ledger/rwset"
	"github.com/hyperledger/fabric-protos-go/ledger/rwset/kvrwset"
	"github.com/hyperledger/fabric-protos-go/msp"
	"github.com/hyperledger/fabric-protos-go/peer"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/ledger"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/fab"
)

//json Marshal/Unmarshal解析工具
//自定义解析类型

//获取区块体数据item
func GetEnvelopeFromBlockRevert(data []byte) (*common.Envelope, error) {
	var err error
	env := &common.Envelope{}
	if err = proto.Unmarshal(data, env); err != nil {
		fmt.Printf("block unmarshal err: %s", err)
	}

	return env, nil
}

//解析Transaction深度递归
func GetTransactionFromEnvelopeDeep(rawEnvelope *common.Envelope) (*Transaction, error) {
	//解析payload
	rawPayload := &common.Payload{}
	err := proto.Unmarshal(rawEnvelope.Payload, rawPayload)
	if err != nil {
		fmt.Printf("block unmarshal err: %s", err)
	}
	//解析channelHeader
	channelHeader := &common.ChannelHeader{}
	err = proto.Unmarshal(rawPayload.Header.ChannelHeader, channelHeader)
	if err != nil {
		fmt.Printf("block unmarshal err: %s\n", err)
	}
	//解析Transaction
	transactionObj := &peer.Transaction{}
	err = proto.Unmarshal(rawPayload.Data, transactionObj)
	if err != nil {
		fmt.Printf("block unmarshal err: %s\n", err)
	}
	transactionActionList := []*TransactionAction{}
	//解析transactionAction
	for i := range transactionObj.Actions {
		transactionAction, err := GetTransactionActionFromTransactionDeep(transactionObj.Actions[i])
		if err != nil {
			fmt.Printf("block unmarshal err: %s\n", err)
		}
		transactionAction.TxId = channelHeader.TxId
		transactionAction.Type = string(channelHeader.Type)
		transactionAction.Timestamp = time.Unix(channelHeader.Timestamp.Seconds, 0).Format("2006-01-02 15:04:05")
		transactionAction.ChannelId = channelHeader.ChannelId
		transactionActionList = append(transactionActionList, transactionAction)
	}
	transaction := Transaction{transactionActionList}

	return &transaction, nil
}

func GetTransactionActionFromTransactionDeep(transactionAction *peer.TransactionAction) (*TransactionAction, error) {

	//解析ChaincodeActionPayload 1
	ChaincodeActionPayload := &peer.ChaincodeActionPayload{}
	err := proto.Unmarshal(transactionAction.Payload, ChaincodeActionPayload)
	if err != nil {
		fmt.Printf("block unmarshal err: %s\n", err)
	}

	//解析ProposalResponsePayload 1.2
	ProposalResponsePayload := &peer.ProposalResponsePayload{}
	ChaincodeAction := &peer.ChaincodeAction{}
	chaincodeId := ""
	NsReadWriteSetList := []*rwset.NsReadWriteSet{}
	ReadWriteSetList := []*kvrwset.KVRWSet{}
	readSetList := []string{}
	writeSetList := []string{}
	if ChaincodeActionPayload.GetAction() != nil {
		err = proto.Unmarshal(ChaincodeActionPayload.Action.ProposalResponsePayload, ProposalResponsePayload)
		if err != nil {
			fmt.Printf("block unmarshal err: %s", err)
		}
		//解析ChaincodeAction 1.2.1
		err = proto.Unmarshal(ProposalResponsePayload.Extension, ChaincodeAction)
		if err != nil {
			fmt.Printf("block unmarshal err: %s", err)
		}

		chaincodeId = ChaincodeAction.ChaincodeId.Name
		//解析TxReadWriteSet	1.2.1.1
		TxReadWriteSet := &rwset.TxReadWriteSet{}
		err = proto.Unmarshal(ChaincodeAction.Results, TxReadWriteSet)
		if err != nil {
			fmt.Printf("block unmarshal err: %s", err)
		}
		//解析TxReadWriteSet	1.2.1.1.1
		for i := range TxReadWriteSet.NsRwset {
			ReadWriteSet := &kvrwset.KVRWSet{}
			//解析ReadWriteSet	1.2.1.1.1.1
			err = proto.Unmarshal(TxReadWriteSet.NsRwset[i].Rwset, ReadWriteSet)
			if err != nil {
				fmt.Printf("block unmarshal err: %s", err)
			}

			//解析读集
			for i := range ReadWriteSet.Reads {
				readSetJsonStr, err := json.Marshal(ReadWriteSet.Reads[i])
				if err != nil {
					fmt.Printf("block unmarshal err: %s", err)
				}
				readSetList = append(readSetList, string(readSetJsonStr))
			}

			//解析写集
			for i := range ReadWriteSet.Writes {
				writeSetItem := map[string]interface{}{
					"Key":      ReadWriteSet.Writes[i].GetKey(),
					"Value":    string(ReadWriteSet.Writes[i].GetValue()),
					"IsDelete": ReadWriteSet.Writes[i].GetIsDelete(),
				}

				writeSetJsonStr, err := json.Marshal(writeSetItem)
				if err != nil {
					fmt.Printf("block unmarshal err: %s", err)
				}
				writeSetList = append(writeSetList, string(writeSetJsonStr))

			}

			ReadWriteSetList = append(ReadWriteSetList, ReadWriteSet)
			NsReadWriteSetList = append(NsReadWriteSetList, TxReadWriteSet.NsRwset[i])
		}

	} else {
		chaincodeId = "没有交易数据"
	}

	//log.Println("数据:"+fmt.Sprintf("%s\n",ChaincodeActionPayload.Action.GetEndorsements()[0] ))
	//解析Endorsements 1.3
	endorsements := []string{}
	if ChaincodeActionPayload.Action.GetEndorsements() != nil {
		for i := range ChaincodeActionPayload.Action.GetEndorsements() {
			endorser := &msp.SerializedIdentity{}
			err = proto.Unmarshal(ChaincodeActionPayload.Action.Endorsements[i].Endorser, endorser)
			if err != nil {
				fmt.Printf("block unmarshal err: %s", err)
			}

			endorsements = append(endorsements, string(endorser.Mspid))
		}
	}

	transactionActionObj := TransactionAction{
		Endorsements: endorsements,
		ChaincodeId:  chaincodeId,
		ReadSetList:  readSetList,
		WriteSetList: writeSetList,
	}

	return &transactionActionObj, nil
}

//查询指定区块信息
func QueryBlockByBlockNumber(LedgerClient *ledger.Client, num int64) (*Block, error) {
	rawBlock, err := LedgerClient.QueryBlock(uint64(num))
	if err != nil {
		fmt.Printf("QueryBlock return error: %s", err)
		return nil, err
	}

	//解析区块体
	txList := []*Transaction{}
	for i := range rawBlock.Data.Data {
		rawEnvelope, err := GetEnvelopeFromBlock(rawBlock.Data.Data[i])
		if err != nil {
			fmt.Printf("QueryBlock return error: %s", err)
			return nil, err
		}
		transaction, err := GetTransactionFromEnvelopeDeep(rawEnvelope)
		if err != nil {
			fmt.Printf("QueryBlock return error: %s", err)
			return nil, err
		}
		for i := range transaction.TransactionActionList {
			transaction.TransactionActionList[i].BlockNum = rawBlock.Header.Number
		}
		txList = append(txList, transaction)
	}

	block := Block{
		Number:          rawBlock.Header.Number,
		PreviousHash:    rawBlock.Header.PreviousHash,
		DataHash:        rawBlock.Header.DataHash,
		BlockHash:       rawBlock.Header.DataHash, //需要计算
		TxNum:           len(rawBlock.Data.Data),
		TransactionList: txList,
		CreateTime:      txList[0].TransactionActionList[0].Timestamp,
	}

	//fmt.Println(block.Number, " ", hex.EncodeToString(block.PreviousHash), " ", hex.EncodeToString(block.DataHash))
	return &block, nil
}

//查询指定区块信息
func QueryBlockByHash(rawBlock *common.Block) (*Block, error) {
	//解析区块体
	txList := []*Transaction{}
	for i := range rawBlock.Data.Data {
		rawEnvelope, err := GetEnvelopeFromBlock(rawBlock.Data.Data[i])
		if err != nil {
			fmt.Printf("QueryBlock return error: %s", err)
			return nil, err
		}
		transaction, err := GetTransactionFromEnvelopeDeep(rawEnvelope)
		if err != nil {
			fmt.Printf("QueryBlock return error: %s", err)
			return nil, err
		}
		for i := range transaction.TransactionActionList {
			transaction.TransactionActionList[i].BlockNum = rawBlock.Header.Number
		}
		txList = append(txList, transaction)
	}

	block := Block{
		Number:          rawBlock.Header.Number,
		PreviousHash:    rawBlock.Header.PreviousHash,
		DataHash:        rawBlock.Header.DataHash,
		BlockHash:       rawBlock.Header.DataHash, //需要计算
		TxNum:           len(rawBlock.Data.Data),
		TransactionList: txList,
		CreateTime:      txList[0].TransactionActionList[0].Timestamp,
	}

	return &block, nil
}

//查询交易信息
func QueryTransactionByTxId(LedgerClient *ledger.Client, txId string) (*Transaction, error) {
	rawTx, err := LedgerClient.QueryTransaction(fab.TransactionID(txId))
	if err != nil {
		fmt.Printf("QueryBlock return error: %s", err)
		return nil, err
	}

	transaction, err := GetTransactionFromEnvelopeDeep(rawTx.TransactionEnvelope)
	if err != nil {
		fmt.Printf("QueryBlock return error: %s", err)
		return nil, err
	}
	block, err := LedgerClient.QueryBlockByTxID(fab.TransactionID(txId))
	if err != nil {
		fmt.Printf("QueryBlock return error: %s", err)
		return nil, err
	}
	for i := range transaction.TransactionActionList {
		transaction.TransactionActionList[i].BlockNum = block.Header.Number
	}
	return transaction, nil
}

func GetEnvelopeFromBlock(data []byte) (*common.Envelope, error) {
	var err error
	env := &common.Envelope{}
	if err = proto.Unmarshal(data, env); err != nil {
		fmt.Printf("block unmarshal err: %s", err)
	}

	return env, nil
}

// func QueryTransactionByTxIdJsonStr(txId string) (string, error) {
// 	transaction, err := QueryTransactionByTxId(txId)
// 	if err != nil {
// 		return "", err
// 	}
// 	jsonStr, err := json.Marshal(transaction)
// 	return string(jsonStr), err
// }

// func QueryTransactionByTxIdByte(txId string) []byte {
// 	transaction, err := QueryTransactionByTxId(txId)
// 	if err != nil {
// 		return []byte("")
// 	}
// 	jsonStr, err := json.Marshal(transaction)
// 	return jsonStr
// }
