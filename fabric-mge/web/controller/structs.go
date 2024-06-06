package controller

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MetaData struct {
	Id                  string    `json:"id"`
	Title               string    `json:"title"`       // 标题
	Category            string    `json:"category"`    // 所属类别，暂时不用
	CategoryId          int       `json:"category_id"` // 所属类别，暂时不用
	Source              string    `json:"source"`
	Methods             []string  `json:"methods"`
	Tid                 string    `json:"tid"`       // 使用的模板
	Keywords            []string  `json:"keywords"`  // 关键词
	Doi                 string    `json:"doi"`       // doi
	Abstract            string    `json:"abstract"`  // 简介
	Author              string    `json:"author"`    // 创建的用户
	AddTime             string    `json:"add_time"`  // 创建时间
	Content             string    `json:"content"`   // 数据内容
	Reference           string    `json:"reference"` //参考
	Project             string    `json:"project"`   //所属项目
	Subject             string    `json:"subject"`   //所属课题
	Contributor         string    `json:"contributor"`
	Institution         string    `json:"institution"`
	ReviewState         int       `json:"review_state"` // 审核状态
	Reviewer            string    `json:"reviewer"`
	ReviewerIns         string    `json:"reviewer_ins"`
	Approved            bool      `json:"approved"` //是否审核过
	ExternalLink        []string  `json:"external_link"`
	PublicDate          string    `json:"public_date"`  //公开日期
	PublicRange         string    `json:"public_range"` // 公开范围
	PlatformBelong      string    `json:"platform_belong"`
	Template            Template_ `json:"template"` // 所属模板
	Score               int       `json:"score"`
	Downloads           int       `json:"downloads"`
	Views               int       `json:"views"`
	UploaderInstitution string    `json:"uploader_institution"`
	ProjectName         string    `json:"project_name"`
	SubjectName         string    `json:"subject_name"`
	DataSetRefCount     int       `json:"dataset_ref_count"`
}

type LogTable struct {
	Id        primitive.ObjectID `bson:"lid"`
	LogTime   time.Time          `bson:"logtime"`
	EventName string             `bson:"eventName"`
	EventId   string             `bson:"eventId"`
	SourceUrl string             `bson:"sourceUrl"`
	TxId      string             `bson:"txId"`
	DataId    string             `bson:"dataId"`
}

type PLogTable struct {
	Id        primitive.ObjectID `bson:"pid"`
	LogTime   time.Time          `bson:"logtime"`
	EventName string             `bson:"eventName"`
	Host      string             `bson:"host"`
	Pmethod   string             `bson:"pmethod"`
	Url       string             `bson:"url"`
}

type LogItem struct {
	Id        primitive.ObjectID `bson:"_id"`
	LogTable  LogTable           `bson:"logtable"`
	PLogTable PLogTable          `bson:"plogtable"`
	Time      string             `bson:"time"`
	DataId    string             `bson:"dataId"`
}

//暂时用不上
type Res struct {
	Code int      `json:"code"`
	Data MetaData `json:"data"`
}

//暂时用不上
type ResWithSign struct {
	Code         int      `json:"code"`
	Data         MetaData `json:"data"`
	Sign         string   `json:"sign"`
	PublicKeyUrl string   `json:"publicKeyUrl"`
	SignText     string   `json:"signText"`
}

//暂时用不上
type ResDataIdWithSign struct {
	Code         int    `json:"code"`
	Data         string `json:"data"` //data id
	Sign         string `json:"sign"`
	PublicKeyUrl string `json:"publicKeyUrl"`
	SignText     string `json:"signText"`
}

type ResOfFinish struct {
	IsSuccess int           `json:"isSuccess"`
	Sign      string        `json:"sign"`
	Data      MetaOfAddData `json:"data"`
}

type Source struct {
	Source    string `json:"source"`
	Reference string `json:"reference"`
	Methods   string `json:"methods"`
}

type OtherInfo struct {
	Project string `json:"project"` //所属项目
	Subject string `json:"subject"` //所属课题
}

type TemplateOfAddData struct {
	Id         string `json:"id"`
	Title      string `json:"title"`       // 标题
	Category   string `json:"category"`    // 所属类别
	CategoryId int    `json:"category_id"` // 所属类别
	Author     string `json:"author"`
	Abstract   string `json:"abstract"`
	RefCount   string `json:"ref_count"`
	PubDate    string `json:"pub_date"`
	Username   string `json:"username"`
	Published  bool   `json:"published"`
	Content    string `json:"content"`
}

type MetaDataOfAddData struct {
	Id           string            `json:"id"`
	Title        string            `json:"title"` // 标题
	Source       Source            `json:"source"`
	Tid          int               `json:"tid"`      // 使用的模板
	Keywords     string            `json:"keywords"` // 关键词
	Doi          string            `json:"doi"`      // doi
	Abstract     string            `json:"abstract"` // 简介
	OtherInfo    OtherInfo         `json:"other_info"`
	Contributor  string            `json:"contributor"`
	Institution  string            `json:"institution"`
	PublicDate   int               `json:"public_date"`  //公开日期
	PublicRange  int               `json:"public_range"` // 公开范围
	Category     int               `json:"category"`
	CategoryName string            `json:"category_name"`
	AddTime      string            `json:"add_time"`
	Template     TemplateOfAddData `json:"template"`
}

type MetaOfAddData struct {
	Meta    MetaDataOfAddData `json:"meta"`
	Content string            `json:"content"` // 数据内容
}

//这个结构体用来序列化往python端发送的区块哈希
type DataOfUpdateMPT struct {
	Title     string `json:"title"`
	BlockHash string `json:"blockhash"`
}

type QueryAddr struct {
	Title string `json:"title"`
	Addr  string `json:"addr"`
}

type QueryAddrList struct {
	QId  string      `json:"id"`
	Data []QueryAddr `json:"data"`
}

//这个结构体用来计算当前区块的哈希用的ASN1
type BlockHash struct {
	Number       int64
	PreviousHash []byte
	DataHash     []byte
}

// 上传数据用，发给链码
type UpdateVO struct {
	CategoryId     int    `json:"categoryId"`
	OriginDataByte []byte `json:"originDataByte"`
	DataHash       []byte `json:"dataHash"`
	RootHashNew    []byte `json:"rootHashNew"`
	Key            string `json:"key"`
	Proof          []byte `json:"proof"`
}

// 检索用
type VO struct {
	VOChain string `json:"voChain"`
	Proof   string `json:"proof"`
}

// 检索用，发给客户端的VO
type ClientVO struct {
	Key   string     `json:"key"`
	VOMap map[int]VO `json:"voMap"`
}

//channel相关
type ChannelRequest struct {
	TaskName           string `json:"taskName"`
	TaskDescription    string `json:"taskDescription"`
	DatasetDescription string `json:"datasetDescription"`
	InitiatorInfo      string `json:"initiatorInfo"`
	MlMethod           string `json:"mlMethod"`
	AggregationMethod  string `json:"aggregationMethod"`
	TeeEnabled         bool `json:"teeEnabled"`
	Invitee            []string `json:"invitee"`
}


//  任务
type Task struct {
	ID                string            `json:"id"`
	Name              string            `json:"name"`
	Description       string            `json:"description"`
	DatasetMeta       string            `json:"datasetMeta"` // 数据集元数据的title
	MLMethod          string            `json:"mlMethod"`
	AggregationMethod string            `json:"aggregationMethod"`
	UseTEE            bool              `json:"useTEE"`
	InitiateOrg       string            `json:"initiateOrg"`   // 任务发起组织的名称，组织对应python后端的用户
	InvitedOrgs       []string          `json:"invitedOrgs"`   // 被邀请组织的名称数组
	AcceptedOrgs      []string          `json:"acceptedOrgs"`  // 接受邀请的被邀请组织的名称数组(如果发起方需要训练，则把发起方的名字也放进去)
	OrgsTrainDatasets map[string]string `json:"orgs_datasets"` // 各参与训练的组织选取的训练集名称
	TestDataset       string            `json:"test_dataset"`  // 测试集名称
	TaskStatus        int               `json:"taskStatus"`    // 0正在邀请，1可以开始，2正在进行，3执行完毕
}
