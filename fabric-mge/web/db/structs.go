package db

type DataOfCategory struct {
	Abstract     string `json:"abstract"`
	AddTime      string `json:"add_time"` // ?
	Category     int    `json:"category"`
	CategoryName string `json:"category_name"`
	Downloads    int    `json:"downloads"`
	ExternalLink string `json:"external_link"`
	Id           string `json:"id"`
	Methods      string `json:"methods"`
	Project      string `json:"project"`
	Realname     string `json:"realname"`
	Score        int    `json:"score"`
	Source       string `json:"source"`
	Subject      string `json:"subject"`
	Template     string `json:"template"` //tid
	TemplateName string `json:"template_name"`
	Title        string `json:"title"`
	User         string `json:"user"`
	Views        int    `json:"views"`
}

type DataOfCategoryRes struct {
	Download int            `json:"download"`
	Score    int            `json:"score"`
	Data     DataOfCategory `json:"data"`
}

type Categories struct {
	CountAtLeast int          `json:"count_at_least"`
	Id           int          `json:"id"`
	Name         string       `json:"name"`
	Url          string       `json:"url"`
	Download     bool         `json:"download"`
	Templates    []Categories `json:"templates"`
}

type Summary struct {
	Category []Categories `json:"category"`
	Keywords []string     `json:"keywords"`
	Realname []string     `json:"realname"`
}
