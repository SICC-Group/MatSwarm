package service

type MetaData_ struct {
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

type Res struct {
	Code int       `json:"code"`
	Data MetaData_ `json:"data"`
}

type ResWithSign struct {
	Code         int       `json:"code"`
	Data         MetaData_ `json:"data"`
	Sign         string    `json:"sign"`
	PublicKeyUrl string    `json:"publicKeyUrl"`
	SignText     string    `json:"signText"`
}

type ResDataIdWithSign struct {
	Code         int    `json:"code"`
	Data         int    `json:"data"`
	Sign         string `json:"sign"`
	PublicKeyUrl string `json:"publicKeyUrl"`
	SignText     string `json:"signText"`
}

type ResOfFinish struct {
	IsSuccess int           `json:"isSuccess"`
	Sign      string        `json:"sign"`
	Data      MetaOfAddData `json:"data"`
}

// 以下用于提交数据

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
	Category   int    `json:"category"`    // 所属类别，暂时不用
	CategoryId int    `json:"category_id"` // 所属类别，暂时不用
	Author     string `json:"author"`
	Abstract   string `json:"abstract"`
	RefCount   string `json:"ref_count"`
	PubDate    string `json:"pub_date"`
	Username   string `json:"username"`
	Published  bool   `json:"published"`
	Content    string `json:"content"`
}

type MetaDataOfAddData struct {
	Id          string            `json:"id"`
	Title       string            `json:"title"` // 标题
	Source      Source            `json:"source"`
	Tid         int               `json:"tid"`      // 使用的模板
	Keywords    string            `json:"keywords"` // 关键词
	Doi         string            `json:"doi"`      // doi
	Abstract    string            `json:"abstract"` // 简介
	OtherInfo   OtherInfo         `json:"other_info"`
	Contributor string            `json:"contributor"`
	Institution string            `json:"institution"`
	PublicDate  int               `json:"public_date"`  //公开日期
	PublicRange int               `json:"public_range"` // 公开范围
	Category    string            `json:"category"`
	AddTime     string            `json:"add_time"`
	Template    TemplateOfAddData `json:"template"`
}

type MetaOfAddData struct {
	Meta    MetaDataOfAddData `json:"meta"`
	Content string            `json:"content"` // 数据内容
}

type WriteSet struct {
	IsDelete bool   `json:"IsDelete"`
	Key      string `json:"Key"`
	Value    string `json:"Value"`
}

type DataOfUpdateMPT struct {
	Data    MetaOfAddData `json:"data"`
	Address string        `json:"address"`
}

type QueryAddr struct {
	Title string `json:"title"`
	Addr  string `json:"addr"`
}

type QueryAddrList struct {
	Id   string      `json:"id"`
	Data []QueryAddr `json:"data"`
}
