package service

import (
	"fabric-mge/logger"
	"fabric-mge/sdkInit"
	"fabric-mge/web/db"
	"fmt"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethdb"
	"github.com/ethereum/go-ethereum/trie"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/context"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/fab"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
)

type Education struct {
	ObjectType     string `json:"docType"`
	Name           string `json:"Name"`           // 姓名
	Gender         string `json:"Gender"`         // 性别
	Nation         string `json:"Nation"`         // 民族
	EntityID       string `json:"EntityID"`       // 身份证号
	Place          string `json:"Place"`          // 籍贯
	BirthDay       string `json:"BirthDay"`       // 出生日期
	EnrollDate     string `json:"EnrollDate"`     // 入学日期
	GraduationDate string `json:"GraduationDate"` // 毕（结）业日期
	SchoolName     string `json:"SchoolName"`     // 学校名称
	Major          string `json:"Major"`          // 专业
	QuaType        string `json:"QuaType"`        // 学历类别
	Length         string `json:"Length"`         // 学制
	Mode           string `json:"Mode"`           // 学习形式
	Level          string `json:"Level"`          // 层次
	Graduation     string `json:"Graduation"`     // 毕（结）业
	CertNo         string `json:"CertNo"`         // 证书编号

	Photo string `json:"Photo"` // 照片

	Historys []HistoryItem // 当前edu的历史记录
}

type HistoryItem struct {
	TxId      string
	Education Education
}

type MptDB struct {
	LevelDB ethdb.Database `json:"leveldb"`
	TrieDb  *trie.Database `json:"triedb"`
}

type ServiceSetup struct {
	ChaincodeID string
	Client      *channel.Client
	Mpt         *trie.Trie
	MptList     map[int]common.Hash
	MptBitMap   *trie.Trie
	Mptdb       MptDB
}

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
}

type MetaData struct {
	Id                  string   `json:"id"`
	Title               string   `json:"title"`       // 标题
	Category            string   `json:"category"`    // 所属类别，暂时不用
	CategoryId          int      `json:"category_id"` // 所属类别，暂时不用
	Source              string   `json:"source"`
	Methods             []string `json:"methods"`
	Tid                 string   `json:"tid"`       // 使用的模板
	Keywords            []string `json:"keywords"`  // 关键词
	Doi                 string   `json:"doi"`       // doi
	Abstract            string   `json:"abstract"`  // 简介
	Author              string   `json:"author"`    // 创建的用户
	AddTime             string   `json:"add_time"`  // 创建时间
	Content             string   `json:"content"`   // 数据内容
	Reference           string   `json:"reference"` //参考
	Project             string   `json:"project"`   //所属项目
	Subject             string   `json:"subject"`   //所属课题
	Contributor         string   `json:"contributor"`
	Institution         string   `json:"institution"`
	ReviewState         int      `json:"review_state"` // 审核状态
	Reviewer            string   `json:"reviewer"`
	ReviewerIns         string   `json:"reviewer_ins"`
	Approved            bool     `json:"approved"` //是否审核过
	ExternalLink        []string `json:"external_link"`
	PublicDate          string   `json:"public_date"`  //公开日期
	PublicRange         string   `json:"public_range"` // 公开范围
	PlatformBelong      string   `json:"platform_belong"`
	Template            Template `json:"template"` // 所属模板
	Score               int      `json:"score"`
	Downloads           int      `json:"downloads"`
	Views               int      `json:"views"`
	UploaderInstitution string   `json:"uploader_institution"`
	ProjectName         string   `json:"project_name"`
	SubjectName         string   `json:"subject_name"`
	DataSetRefCount     int      `json:"dataset_ref_count"`
}

func regitserEvent(client *channel.Client, chaincodeID, eventID string) (fab.Registration, <-chan *fab.CCEvent) {

	reg, notifier, err := client.RegisterChaincodeEvent(chaincodeID, eventID)
	if err != nil {
		fmt.Printf("注册链码事件失败: %s", err)
	}
	return reg, notifier
}

func eventResult(notifier <-chan *fab.CCEvent, eventID string) error {
	fmt.Println("111")
	select {
	case ccEvent := <-notifier:
		fmt.Printf("接收到链码事件: %v\n", ccEvent)
		//logger.Infof("fabric接收到链码事件: %v\n", ccEvent)
		logger.Infof("******************************")
		logger.Infof("时间: %v\n", time.Now())
		logger.Infof("接收到链码事件: %v\n", ccEvent.EventName)
		logger.Infof("事件ID: %v\n", ccEvent.ChaincodeID)
		logger.Infof("来源URL: %v\n", ccEvent.SourceURL)
		logger.Infof("TxID: %v\n", ccEvent.TxID)
		logger.Infof("******************************\r")

		logres := db.LogTable{
			LogTime:   time.Now(),
			EventName: ccEvent.EventName,
			EventId:   ccEvent.ChaincodeID,
			SourceUrl: ccEvent.SourceURL,
			TxId:      ccEvent.TxID,
		}
		db.AddLogData(&logres)

	case <-time.After(time.Second * 20):
		return fmt.Errorf("不能根据指定的事件ID接收到相应的链码事件(%s)", eventID)
	}
	return nil
}

func eventResult_data(notifier <-chan *fab.CCEvent, eventID string, dataID string) error {
	select {
	case ccEvent := <-notifier:
		fmt.Printf("接收到链码事件: %v\n", ccEvent)
		//logger.Infof("fabric接收到链码事件: %v\n", ccEvent)
		logger.Infof("******************************")
		logger.Infof("时间: %v\n", time.Now())
		logger.Infof("接收到链码事件: %v\n", ccEvent.EventName)
		logger.Infof("事件ID: %v\n", ccEvent.ChaincodeID)
		logger.Infof("来源URL: %v\n", ccEvent.SourceURL)
		logger.Infof("TxID: %v\n", ccEvent.TxID)
		logger.Infof("涉及数据ID: %v\n", dataID)
		logger.Infof("******************************\r")

		logres := db.LogTable{
			LogTime:   time.Now(),
			EventName: ccEvent.EventName,
			EventId:   ccEvent.ChaincodeID,
			SourceUrl: ccEvent.SourceURL,
			TxId:      ccEvent.TxID,
			DataId:    dataID,
		}
		db.AddLogData(&logres)

	case <-time.After(time.Second * 20):
		return fmt.Errorf("不能根据指定的事件ID接收到相应的链码事件(%s)", eventID)
	}
	return nil
}

var ClientChannelContext context.ChannelProvider

func InitService(chaincodeID, channelID string, org *sdkInit.OrgInfo,
	sdk *fabsdk.FabricSDK, mpt *trie.Trie, mptList map[int]common.Hash, mptBitMap *trie.Trie, mptdb MptDB) (*ServiceSetup, error) {
	handler := &ServiceSetup{
		ChaincodeID: chaincodeID,
		Mpt:         mpt,
		MptList:     mptList,
		MptBitMap:   mptBitMap,
		Mptdb:       mptdb,
	}
	//prepare channel client context using client context
	ClientChannelContext = sdk.ChannelContext(channelID, fabsdk.WithUser(org.OrgUser), fabsdk.WithOrg(org.OrgName))
	// Channel client is used to query and execute transactions (Org1 is default org)
	client, err := channel.New(ClientChannelContext)
	if err != nil {
		return nil, fmt.Errorf("Failed to create new channel client: %s", err)
	}
	handler.Client = client
	return handler, nil
}
