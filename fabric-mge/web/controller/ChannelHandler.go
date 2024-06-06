package controller

import (
	"encoding/json"
	"fabric-mge/sdkInit"
	"fmt"
	"io"
	"io/ioutil"

	"net/http"
	"os"

	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
)

var (
	info *sdkInit.SdkEnvInfo
	sdk  *fabsdk.FabricSDK
	// mpt       *trie.Trie          // [key, value] = [word, blockHash] 暂时不用了
	// mptList   map[int]common.Hash // map的键值对为[categoryId, categoryTrieHash] trie的键值对为 [key, value] = [word, RWset]
	// mptBitMap *trie.Trie          // [key, value] = [word, categoryBitmap]
	// mptdb     service.MptDB
)

const (
	cc_name    = "simplecc"
	cc_version = "1.0.0"
)

func (app *Application) HandleChannelRequest(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from HandleChannelRequest, 处理跨域options请求")
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
	// body, _ := ioutil.ReadAll(r.Body)
	// fmt.Println("原数据",body)
	// 解析 JSON 请求体
	var req ChannelRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	// fmt.Println("解析后数据",req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	initOrgsInfo()
	sdk, err = sdkInit.Setup("config.yaml", info)
	if err != nil {
		fmt.Println(">> SDK setup error:", err)
		os.Exit(-1)
	}

	// 创建和加入通道
	fmt.Println("创建和加入通道")
	err = sdkInit.CreateAndJoinChannel(info)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回成功响应
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Channel created and node joined successfully")
}

func initOrgsInfo() {
	pwd, _ := os.Getwd()

	// init orgs information
	orgs := []*sdkInit.OrgInfo{
		{
			OrgAdminUser:  "Admin",
			OrgName:       "Org1",
			OrgMspId:      "Org1MSP",
			OrgUser:       "User1",
			OrgPeerNum:    1,
			OrgAnchorFile: pwd + "/fixtures/channel-artifacts/Org1MSPanchors.tx",
		},
		{
			OrgAdminUser:  "Admin",
			OrgName:       "Org2",
			OrgMspId:      "Org2MSP",
			OrgUser:       "User1",
			OrgPeerNum:    1,
			OrgAnchorFile: pwd + "/fixtures/channel-artifacts/Org2MSPanchors.tx",
		},
	}

	// init sdk env info
	info = &sdkInit.SdkEnvInfo{
		ChannelID:        "testchannel",
		ChannelConfig:    pwd + "/fixtures/channel-artifacts/channel.tx",
		Orgs:             orgs,
		OrdererAdminUser: "Admin",
		OrdererOrgName:   "OrdererOrg",
		OrdererEndpoint:  "orderer.example.com",
		ChaincodeID:      cc_name,
		ChaincodePath:    pwd + "/chaincode/",
		ChaincodeVersion: cc_version,
		SDK:              sdk,
	}
}

func (app *Application) StartTrain(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from HandleChannelRequest, 处理跨域options请求")
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
	fmt.Println("原数据", body)
	var data map[int][]float64
	if err := json.Unmarshal(body, &data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("解析后的数据", data)
	response, err := app.Setup.FCtrain(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回链码执行结果
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
