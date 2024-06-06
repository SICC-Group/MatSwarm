package controller

import (
	"encoding/json"
	"fabric-mge/service"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type LoginRequest struct {
	user string `json:"user"`
	password string `json:"password"`
}

type dataOfLoginResp struct {
	User  string `json:"user"`
	Email string `json:"email"`
}

type LoginResp struct {
	Code int             `json:"code"`
	Msg  string          `json:"msg"`
	Data dataOfLoginResp `json:"data"`
}

func (app *Application) LoginUser(w http.ResponseWriter, r *http.Request) {
	setupCORS(&w)
	if r.Method == "OPTIONS" {
		return // 处理CORS预检请求
	}

	// 解析请求体中的用户名和密码
	var loginInfo struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	body, _ := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	err := json.Unmarshal(body, &loginInfo)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// 将用户名和密码编码为[]byte，准备发送给链码
	// username := []byte(loginInfo.Username)
	// password := []byte(loginInfo.Password)
	// fmt.Println(username,password)

	loginReq := LoginRequest{
		user: loginInfo.Username, // 这里替换为实际的用户名
		password: loginInfo.Password, // 这里替换为实际的密码
	}
	fmt.Println(loginReq)

	// reqBody, err := json.Marshal(loginReq)

	// //将登录请求发送给后端
	// req, err := http.NewRequest("POST", "http://localhost:8000/api/v1/account/login/", bytes.NewBuffer(reqBody))
	// if err != nil {
	// 	fmt.Printf("Error creating request: %s\n", err)
	// 	return
	// }
	// // 设置请求头
	// req.Header.Set("Content-Type", "application/json")
	// // 发送请求
	// client := &http.Client{}
	// resp, err := client.Do(req)
	// if err != nil {
	// 	fmt.Printf("Error sending request: %s\n", err)
	// 	return
	// }
	// defer resp.Body.Close()
	// // 读取响应体
	// respBody, err := ioutil.ReadAll(resp.Body)
	// if err != nil {
	// 	fmt.Printf("Error reading response body: %s\n", err)
	// 	return
	// }
	// var respOfLogin LoginResp
	// err = json.Unmarshal(respBody, &respOfLogin)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// if respOfLogin.Code != 0 {
	// 	fmt.Println(respOfLogin.Msg)
	// 	return
	// }
	// fmt.Printf("Response: %s\n", string(respBody))
	// loginEvent := service.LoginEvent{
	// 	Username:  respOfLogin.Data.User,
	// 	Email:     respOfLogin.Data.Email,
	// 	Status:    "success",
	// 	LoginTime: time.Now(),
	// }
	loginEvent := service.LoginEvent{
		Username:  "111",
		Email:     "111",
		Status:    "success",
		LoginTime: time.Now(),
	}
	// 调用链码处理登录
	response, err := app.Setup.LoginUserEvent(loginEvent)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// 返回链码执行结果
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
