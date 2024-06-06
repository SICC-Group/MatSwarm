package controller

import (
	"bytes"
	"encoding/json"
	"fabric-mge/service"

	"fmt"
	"io"
	"io/ioutil"
	"net/http"
)

type Template_ struct {
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
	Method              int      `json:"method"`
}

func setupCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func (app *Application) GetAllTemplate(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	fmt.Println("1")
	if r.Method == "OPTIONS" {
		fmt.Println("from GetAllTemplate, 处理跨域options请求")
		return
	}
	response, _ := http.Get("http://localhost:8000/api/v1/storage/templates")
	fmt.Println("222")
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body, _ := ioutil.ReadAll(response.Body)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	_, err := w.Write(body)
	if err != nil {
		print("ERROR")
		print(err)
		return
	}
}

func (app *Application) CreateTemplate(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from createTemplate, 处理跨域options请求")
		return
	}
	var res_ service.Template
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(r.Body)
	body, _ := ioutil.ReadAll(r.Body)
	err1 := json.Unmarshal(body, &res_)
	if err1 != nil {
		fmt.Println(err1)
	}
	_, err := app.Setup.SaveMgeTemplate(body)
	if err != nil {
		fmt.Println("保存模板的链码报错了")
		fmt.Println(err)
		// return
	}
	//************************************
	resp, err := http.Post("http://localhost:8000/api/v3/storage/templates/",
		"application/x-www-form-urlencoded", bytes.NewReader(body))
	if err != nil {
		return
	}
	res, _ := ioutil.ReadAll(resp.Body)
	w.Write(res)
}

func (app *Application) GetTemplateByID(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	id := r.URL.Query().Get("templateID")
	response, _ := http.Get("http://localhost:8000/api/v1/storage/template/" + id)
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body, _ := ioutil.ReadAll(response.Body)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	_, err := w.Write(body)
	if err != nil {
		print("ERROR")
		print(err)
		return
	}
}
