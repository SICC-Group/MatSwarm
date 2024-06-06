package controller

import (
	"bytes"
	"encoding/json"
	"fabric-mge/sdkInit"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"time"
)

// peer0.org1.example.com:7051
// peer0.org2.example.com:9051
// ca.org1.example.com:7054
// ca.org2.example.com:9054

// 创建任务
func (app *Application) CreateTask(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from 提交FL任务, 处理跨域options请求")
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
	var task Task
	_ = json.Unmarshal(body, &task)
	task.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	task.TaskStatus = 0
	task_body, _ := json.Marshal(task)
	task.AcceptedOrgs = append(task.AcceptedOrgs, task.InitiateOrg)
	// task暂时被存放在云服务器的mongodb中
	http.Post("http://127.0.0.1:8000/api/v1/task/create/", "application/json", bytes.NewReader(task_body))
	//此处邀请组织，每个被邀组织只被邀请一次，组织收到邀请后调用HandleTaskInvite向webservice发送是否接收task
	invite(task)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	jsonStr := fmt.Sprintf("{'taskId': %s, 'taskName': %s}", task.ID, task.Name)
	_, err := w.Write([]byte(jsonStr))
	if err != nil {
		print("ERROR")
		print(err)
		return
	}
}

// 邀请组织
func invite(task Task) {
	OrgAddressMap := make(map[string]string)
	OrgAddressMap["Org1"] = "peer0.org1.example.com:7051"
	OrgAddressMap["Org2"] = "peer0.org2.example.com:9051"
	task_body, _ := json.Marshal(task)
	for _, value := range task.InvitedOrgs {
		http.Post(OrgAddressMap[value], "application/json", bytes.NewReader(task_body))
	}
	// http.Post("http://127.0.0.1:8000/api/v1/task/create/", "application/json", bytes.NewReader(task_body))
}

// 获取所有组织信息
func (app *Application) GetOrgs(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	pwd, _ := os.Getwd()
	orgs := []*sdkInit.OrgInfo{
		{
			OrgAdminUser:  "Admin",
			OrgName:       "Org1",
			OrgMspId:      "Org1MSP",
			OrgUser:       "User1",
			OrgPeerNum:    1,
			OrgAnchorFile: pwd + "/fixtures/channel-artifacts/Org1MSPanchors.tx",
			OrgAddress:    "peer0.org1.example.com:7051",
		},
		{
			OrgAdminUser:  "Admin",
			OrgName:       "Org2",
			OrgMspId:      "Org2MSP",
			OrgUser:       "User1",
			OrgPeerNum:    1,
			OrgAnchorFile: pwd + "/fixtures/channel-artifacts/Org2MSPanchors.tx",
			OrgAddress:    "peer0.org2.example.com:9051",
		},
	}
	jsonData, err := json.Marshal(orgs)
	if err != nil {
		fmt.Println("JSON encoding failed:", err)
		return
	}
	// 设置响应头
	w.Header().Set("Content-Type", "application/json")
	// 写入响应体
	w.Write(jsonData)
}

// 用户(组织)选取训练集
func (app *Application) SelectDataset(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from AddMgeData, 处理跨域options请求")
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
	data := make(map[string]interface{})
	err := json.Unmarshal(body, &data)
	if err != nil {
		fmt.Println("解析 JSON 数据时出错:", err)
		return
	}
	orgName, _ := data["orgName"].(string)
	datasetTitle, _ := data["datasetTitle"].(string)
	taskID, _ := data["taskID"].(string)

	response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getTask/" + taskID + "/")
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body1, _ := ioutil.ReadAll(response.Body)
	var task Task
	_ = json.Unmarshal(body1, &task)

	task.OrgsTrainDatasets[orgName] = datasetTitle
	fmt.Print(task.OrgsTrainDatasets[orgName])
	task_body, _ := json.Marshal(task)
	http.Post("http://127.0.0.1:8000/api/v1/task/create/", "application/json", bytes.NewReader(task_body))

	// fmt.Println("ID:", task.ID)
	// fmt.Println("Name:", task.Name)
	// fmt.Println("Description:", task.Description)
	// fmt.Println("DatasetMeta:", task.DatasetMeta)
	// fmt.Println("MLMethod:", task.MLMethod)
	// fmt.Println("AggregationMethod:", task.AggregationMethod)
	// fmt.Println("UseTEE:", task.UseTEE)
	// fmt.Println("InitiatOrg:", task.InitiateOrg)
	// fmt.Println("InvitedOrgs:", task.InvitedOrgs)
	// fmt.Println("AcceptedOrgs:", task.AcceptedOrgs)

	w.WriteHeader(http.StatusOK)
}

// 处理任务邀请
func (app *Application) HandleTaskInvite(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from AddMgeData, 处理跨域options请求")
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
	data := make(map[string]interface{})
	err := json.Unmarshal(body, &data)
	if err != nil {
		fmt.Println("解析 JSON 数据时出错:", err)
		return
	}
	orgName, _ := data["orgName"].(string)
	isAccepted, _ := data["isAccepted"].(bool)
	taskID, _ := data["taskID"].(string)
	if isAccepted {
		response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getTask/" + taskID + "/")
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {
				print("ERROR")
				print(err)
				return
			}
		}(response.Body)
		body, _ := ioutil.ReadAll(response.Body)
		var task Task
		_ = json.Unmarshal(body, &task)

		task.AcceptedOrgs = append(task.AcceptedOrgs, orgName)
		if len(task.AcceptedOrgs) >= 2 {
			task.TaskStatus = 1
		}
		task_body, _ := json.Marshal(task)
		http.Post("http://127.0.0.1:8000/api/v1/task/create/", "application/json", bytes.NewReader(task_body))

		// fmt.Println("ID:", task.ID)
		// fmt.Println("Name:", task.Name)
		// fmt.Println("Description:", task.Description)
		// fmt.Println("DatasetMeta:", task.DatasetMeta)
		// fmt.Println("MLMethod:", task.MLMethod)
		// fmt.Println("AggregationMethod:", task.AggregationMethod)
		// fmt.Println("UseTEE:", task.UseTEE)
		// fmt.Println("InitiatOrg:", task.InitiateOrg)
		// fmt.Println("InvitedOrgs:", task.InvitedOrgs)
		// fmt.Println("AcceptedOrgs:", task.AcceptedOrgs)
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "isAccepted: %t, taskId: %s", isAccepted, taskID)
}

// 发起组织查询是否可以开始任务
func (app *Application) IsTaskReadyToStart(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	taskID := r.URL.Query().Get("taskID")
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getTask/" + taskID)
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body, _ := ioutil.ReadAll(response.Body)
	var task Task
	_ = json.Unmarshal(body, &task)
	boolJSON, err := json.Marshal(len(task.AcceptedOrgs) >= 2 || task.TaskStatus == 1)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// 设置响应头
	w.Header().Set("Content-Type", "application/json")
	// 写入响应体
	w.Write(boolJSON)
}

// 开始训练，由任务发起者调用
func (app *Application) StartTask(w http.ResponseWriter, r *http.Request) {

	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	taskID := r.URL.Query().Get("taskID")
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getTask/" + taskID)
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body, _ := ioutil.ReadAll(response.Body)
	var task Task
	_ = json.Unmarshal(body, &task)
	// 以上从云服务器获取task
	task.TaskStatus = 2
	task_body, _ := json.Marshal(task)
	http.Post("http://127.0.0.1:8000/api/v1/task/create/", "application/json", bytes.NewReader(task_body))
	// 以下在python后端进行多用户训练
	response1, _ := http.Post("http://127.0.0.1:8000/api/v1/fl/startTrain_multiuser/"+task.ID, "application/json", bytes.NewReader(task_body))
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body1, _ := ioutil.ReadAll(response1.Body)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	_, err := w.Write(body1)
	if err != nil {
		print("ERROR")
		print(err)
		return
	}
}

// 获取任务中单个组织的训练结果
func (app *Application) GetSingleResult(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		fmt.Println("from AddMgeData, 处理跨域options请求")
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
	data := make(map[string]interface{})
	err := json.Unmarshal(body, &data)
	if err != nil {
		fmt.Println("解析 JSON 数据时出错:", err)
		return
	}
	orgName, _ := data["orgName"].(string)
	taskID, _ := data["taskID"].(string)
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/fl/get_single_result/" + taskID + "/" + orgName)
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			print("ERROR")
			print(err)
			return
		}
	}(response.Body)
	body1, _ := ioutil.ReadAll(response.Body)
	w.Header().Set("content-type", "text/json")
	w.WriteHeader(200)
	_, err1 := w.Write(body1)
	if err1 != nil {
		print("ERROR")
		print(err1)
		return
	}
}

// 获取联邦任务的训练结果
func (app *Application) GetMultiResult(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	taskID := r.URL.Query().Get("taskID")
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/fl/get_multi_result/" + taskID)
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

// 根据id获取一个任务详细信息
func (app *Application) GetTaskByID(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	taskID := r.URL.Query().Get("taskID")
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getTask/" + taskID)
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

func (app *Application) GetInitiateTasks(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	orgName := r.URL.Query().Get("orgName")
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getInitiateTasks/" + orgName)
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

func (app *Application) GetInvitedTasks(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	// db.CreateEmptyTable()
	if r.Method == "OPTIONS" {
		fmt.Println("from GetTemplateByID, 处理跨域options请求")
		return
	}
	orgName := r.URL.Query().Get("orgName")
	response, _ := http.Get("http://127.0.0.1:8000/api/v1/task/getInvitedTasks/" + orgName)
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
