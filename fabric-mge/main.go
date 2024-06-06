package main

import (
	"fabric-mge/sdkInit"
	"fabric-mge/service"
	"fabric-mge/web"
	"fabric-mge/web/controller"
	"fabric-mge/web/db"
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/rawdb"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	"github.com/spf13/cobra"
)

const (
	cc_name    = "simplecc"
	cc_version = "1.0.0"
)


var (
	info      *sdkInit.SdkEnvInfo
	sdk       *fabsdk.FabricSDK
	mpt       *trie.Trie          // [key, value] = [word, blockHash] 暂时不用了
	mptList   map[int]common.Hash // map的键值对为[categoryId, categoryTrieHash] trie的键值对为 [key, value] = [word, RWset]
	mptBitMap *trie.Trie          // [key, value] = [word, categoryBitmap]
	mptdb     service.MptDB
)

//初始化区块链的命令行
var InitBlockChainCmd = &cobra.Command{
	Use:   "InitBlock",
	Short: "初始化区块链",
	Long:  "从搭建区块链网络开始初始化区块链",
	Run: func(cmd *cobra.Command, args []string) {
		blockchainInit()
		serviceSetup, err := service.InitService(info.ChaincodeID, info.ChannelID, info.Orgs[0], sdk,
			mpt, mptList, mptBitMap, mptdb)
		if err != nil {
			fmt.Println()
			os.Exit(-1)
		}

		//dataInit(serviceSetup)
		app := controller.Application{
			Setup: serviceSetup,
		}
		web.WebStart(app)
	},
}

//不初始化区块链网络的命令行
var NotInitBlockChainCmd = &cobra.Command{
	Use:   "NotInitBlock",
	Short: "不初始化区块链",
	Long:  "直接启动web服务器",
	Run: func(cmd *cobra.Command, args []string) {
		serviceSetup, err := service.InitService(info.ChaincodeID, info.ChannelID, info.Orgs[0], sdk,
			mpt, mptList, mptBitMap, mptdb)
		if err != nil {
			fmt.Println()
			os.Exit(-1)
		}

		app := controller.Application{
			Setup: serviceSetup,
		}
		web.WebStart(app)
	},
}

func main() {
	db.MongoInit()
	db.SliceKeyWords("test")
	controller.TestBit()
	//InitOrgInfo
	initOrgsInfo()

	// sdk setup
	var err error
	sdk, err = sdkInit.Setup("config.yaml", info)
	if err != nil {
		fmt.Println(">> SDK setup error:", err)
		os.Exit(-1)
	}
	//初始化MPT树
	initMPTdb()
	initMpt()
	initMptBitMap()
	// db.OnDemandTest()
	var rootCmd = &cobra.Command{}
	rootCmd.AddCommand(InitBlockChainCmd)
	rootCmd.AddCommand(NotInitBlockChainCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

}

// 初始化各个组织信息
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
		ChannelID:        "mychannel",
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

//初始化区块链网络
func blockchainInit() {
	// create channel and join
	if err := sdkInit.CreateAndJoinChannel(info); err != nil {
		fmt.Println(">> Create channel and join error:", err)
		os.Exit(-1)
	}

	// create chaincode lifecycle
	if err := sdkInit.CreateCCLifecycle(info, 1, false, sdk); err != nil {
		fmt.Println(">> create chaincode lifecycle error:", err)
		os.Exit(-1)
	}

}

// 初始化mpt dbs，包括底层leveldb以及中间triedb
func initMPTdb() {
	// 这里如果对应路径的leveldb不存在，会创建对应的db
	levelDB, err := rawdb.NewLevelDBDatabase("./database/db", 16, 16, "MGE-MPT", false)
	if err != nil {
		fmt.Println("创建levelDB失败")
		fmt.Println(err)
	}
	mptdb.LevelDB = levelDB
	mptdb.TrieDb = trie.NewDatabase(levelDB)
}

// 通用初始化trie
func initTrieCommon(text string) *trie.Trie {
	originhash, err := mptdb.LevelDB.Get([]byte(text))
	var tempTrie *trie.Trie
	if originhash == nil && err != nil { // 说明对应的mpt还未被创建过
		tempTrie = trie.NewEmpty(mptdb.TrieDb)
		rootHash := tempTrie.Hash()
		mptdb.LevelDB.Put([]byte(text), rootHash[:])
	} else if err == nil {
		id := trie.ID{
			Root: common.BytesToHash(originhash),
		}
		tempTrie, err = trie.New(&id, mptdb.TrieDb)
		if err != nil {
			fmt.Println("从已有hash中重建mpt错误" + text)
			fmt.Println(err)
		}
	} else {
		fmt.Println("从leveldb读取数据错误，不是not found的错误" + text)
		fmt.Println(err)
	}
	return tempTrie
}

//初始化mpt的过程，暂时放在主函数上。
func initMpt() {
	mpt = initTrieCommon("mge-mpt")
}

func initMptBitMap() {
	// [key, value] = [word, bitmap]
	mptBitMap = initTrieCommon("mge-bitmap")
	// mptList做成[key, value] = [categoryId, 根hash]的格式
	mptList = make(map[int]common.Hash)
	// 需要先遍历mptBitmap，获得categoryIds
	iterator := trie.NewIterator(mptBitMap.NodeIterator(nil))
	var categoryIds []int
	for iterator.Next() {
		if iterator.Err != nil {
			fmt.Println(iterator.Err)
			continue
		}
		categoryIds = append(categoryIds, controller.UnmarshalCategoryIds(iterator.Value)...)
	}
	// 重建mptList
	for _, categoryId := range categoryIds {
		text := "category" + string(rune(categoryId))
		originhash, err := mptdb.LevelDB.Get([]byte(text))
		if err != nil { // 一般来说不会出现originhash为空的问题
			fmt.Println("从leveldb读取categoryId mpt hash错误")
			fmt.Println(err)
		}
		mptList[categoryId] = common.BytesToHash(originhash)
	}
}
