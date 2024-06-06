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
func (app *Application) PFindLogDataById(w http.ResponseWriter, r *http.Request) {
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
	dataTable := db.PGetLogDataById(id)
	res := PLogTable{
		Id:        dataTable.Id,
		LogTime:   dataTable.LogTime,
		EventName: dataTable.EventName,
		Host:      dataTable.Host,
		Pmethod:   dataTable.Pmethod,
		Url:       dataTable.Url,
	}
	resByte, _ := json.Marshal(res)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	w.Write(resByte)
}

func (app *Application) PAddLogData(w http.ResponseWriter, r *http.Request) {
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
	var PData db.PLogTable
	err := json.Unmarshal(bodyI, &PData)
	if err != nil {
		fmt.Println(err)
	}
	db.PAddLogData(&PData)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	// w.Write(resByte)
}
