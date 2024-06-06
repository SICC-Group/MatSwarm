package controller

import (
	"bytes"
	"encoding/json"
	"fabric-mge/web/db"
	"fmt"
	"io/ioutil"
	"net/http"
)

func (app *Application) Query(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from query, 处理跨域options请求")
		return
	}
	body, _ := ioutil.ReadAll(r.Body)
	qId := r.URL.Query().Get("q_id")
	tId := r.URL.Query().Get("t_id")
	msg, err, _ := app.Setup.QueryMgeData(body)
	if err != nil {
		fmt.Println("query的链码报错了")
		fmt.Println(err)
		//return
	}
	fmt.Println("query done: " + msg)
	//************************************
	url := "http://localhost:8000/api/v2/search/query/"
	{
		url = url + qId
	}
	if tId != "" {
		url = url + "/" + tId
	}
	httpReq, _ := http.NewRequest("POST", url, bytes.NewReader(body))
	resp, _ := http.DefaultClient.Do(httpReq)
	rspBody, _ := ioutil.ReadAll(resp.Body)
	// unmarshal: 解析HTTP返回的结果
	w.Write(rspBody)
}

func (app *Application) QueryForAddr(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from query, 处理跨域options请求")
		return
	}
	type Text struct {
		Text string `json:"text"`
	}
	type Q struct {
		Data     []db.DataOfCategoryRes `json:"data"`
		Summary  db.Summary             `json:"summary"`
		Total    int                    `json:"total"`
		Value    Text                   `json:"value"`
		Page     int                    `json:"page"`
		PageSize int                    `json:"page_size"`
	}
	type QueryRes struct {
		Id       string   `json:"id"`
		Q        Q        `json:"q"`
		Username string   `json:"username"`
		ClinetVO ClientVO `json:"clientVO"`
	}
	type DataRes struct {
		Data     []db.DataOfCategoryRes `json:"data"`
		Page     int                    `json:"page"`
		PageSize int                    `json:"page_size"`
		Total    int                    `json:"total"`
	}
	body, _ := ioutil.ReadAll(r.Body)
	qId := r.URL.Query().Get("q_id")
	tId := r.URL.Query().Get("t_id")
	//************************************
	type QueryProps struct {
		Q Text `json:"q"`
	}
	var datalist []db.DataOfCategoryRes
	var summary db.Summary
	var queryText QueryProps
	err := json.Unmarshal(body, &queryText)
	if err != nil {
		fmt.Println("反序列化query内容失败")
		fmt.Println(err)
	}
	categoryList := GetCategoryList(queryText.Q.Text, app.Setup.MptBitMap)
	fmt.Println("这里是category")
	fmt.Println(categoryList)
	categoryListByte, err := json.Marshal(categoryList)
	// 获取VOchain
	msg, err, VOchainMapByte := app.Setup.QueryMgeData(categoryListByte)
	if err != nil {
		fmt.Println("query的链码报错了")
		fmt.Println(err)
		//return
	}
	fmt.Println("query done: " + msg)
	voData := GetClientVO(queryText.Q.Text, VOchainMapByte, categoryList, app.Setup.MptList, app.Setup.Mptdb)
	// qId为空，直接检索，创建QUERY记录
	if qId == "" {
		_ = json.Unmarshal(body, &queryText)
		data := QueryTextToTable(queryText.Q.Text)
		qId = db.AddQueryData(&data)
		// 这两行是老版MPT方案
		// addrList := GetDataFromMpt(app.Setup.Mpt, queryText.Q.Text)
		// datalist, summary = GetDataFromAddr(addrList, qId, tId)
		// 新版MPT方案
		datalist, summary = GetRWSetFromCategory(categoryList, app.Setup.MptList, queryText.Q.Text, qId, tId, app.Setup.Mptdb)
		fmt.Println(summary)
		data = QueryToTable(summary, datalist, queryText.Q.Text)
		db.EditQueryData(&data, qId)
	} else {
		// qid不为空，已经创建过QUERY记录，直接从数据库里拿
		datalist, summary = GetQueryDataByQId(qId, tId)
	}
	if tId == "" {
		query := Q{
			Data:     datalist,
			Summary:  summary,
			Total:    len(datalist),
			Value:    queryText.Q,
			Page:     1,
			PageSize: 20,
		}
		returnRes := QueryRes{
			Id:       qId,
			Username: "",
			Q:        query,
			ClinetVO: voData,
		}
		var test QueryRes
		returnByte, _ := json.Marshal(returnRes)
		_ = json.Unmarshal(returnByte, &test)
		fmt.Println("from query")
		fmt.Println(test.ClinetVO.VOMap[101].VOChain)
		w.Write(returnByte)
	} else {
		temp := DataRes{
			Data:     datalist,
			Total:    len(datalist),
			Page:     1,
			PageSize: 20,
		}
		returnByte, _ := json.Marshal(temp)
		w.Write(returnByte)
	}
}
