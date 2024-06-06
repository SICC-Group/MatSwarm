package controller

import (
	"encoding/json"
	"fabric-mge/web/db"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
)

// FindMgeDataById 请求格式 dataID = xxx
func (app *Application) FindLogDataById(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from FindLogDataById, 处理跨域options请求")
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
	bodyI, _ := ioutil.ReadAll(r.Body)
	id := r.URL.Query().Get("logdataID")
	fmt.Println("收到请求查询的数据id:", id)
	msg, err := app.Setup.FindMgeData(bodyI)
	if err != nil {
		fmt.Println("findLogDataById的链码报错了")
		fmt.Println(err)
		//return
	}
	fmt.Println("findLogDataById done: " + msg)
	dataTable := db.GetLogDataById(id)
	// res := LogItem{
	// 	Id:        dataTable.Id,
	// 	LogTable:  LogTable(dataTable.LogTable),
	// 	PLogTable: PLogTable(dataTable.PLogTable),
	// 	Time:      dataTable.Time,
	// 	DataId:    dataTable.DataId,
	// }
	resByte, _ := json.Marshal(dataTable)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	w.Write(resByte)
}

func (app *Application) FindLogDataByDataId(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from FindLogDataById, 处理跨域options请求")
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
	bodyI, _ := ioutil.ReadAll(r.Body)
	id := r.URL.Query().Get("dataID")
	fmt.Println("收到请求查询的数据id:", id)
	msg, err := app.Setup.FindMgeData(bodyI)
	if err != nil {
		fmt.Println("findLogDataById的链码报错了")
		fmt.Println(err)
		//return
	}
	fmt.Println("findLogDataById done: " + msg)
	dataTable := db.GetLogDataByDataId(id)
	resByte, _ := json.Marshal(dataTable)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	w.Write(resByte)
}

func (app *Application) FindLogData(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from FindLogDataById, 处理跨域options请求")
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
	bodyI, _ := ioutil.ReadAll(r.Body)
	msg, err := app.Setup.FindMgeData(bodyI)
	if err != nil {
		fmt.Println("findLogDataById的链码报错了")
		fmt.Println(err)
		//return
	}
	fmt.Println("findLogDataById done: " + msg)
	dataTable := db.GetLogData()
	resByte, _ := json.Marshal(dataTable)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	w.Write(resByte)
}
