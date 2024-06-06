/**
  @Author : hanxiaodong
*/

package web

import (
	"fabric-mge/web/controller"
	"fmt"
	"net/http"
)

// 启动Web服务并指定路由信息
func WebStart(app controller.Application) {

	fs := http.FileServer(http.Dir("web/static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// 指定路由信息(匹配请求)
	http.HandleFunc("/", app.LoginView)
	http.HandleFunc("/login", app.Login)
	http.HandleFunc("/loginout", app.LoginOut)
	http.HandleFunc("/index", app.Index)
	http.HandleFunc("/help", app.Help)
	http.HandleFunc("/addEduInfo", app.AddEduShow)         // 显示添加信息页面
	http.HandleFunc("/addEdu", app.AddEdu)                 // 提交信息请求
	http.HandleFunc("/queryPage", app.QueryPage)           // 转至根据证书编号与姓名查询信息页面
	http.HandleFunc("/api/query", app.FindCertByNoAndName) // 根据证书编号与姓名查询信息
	http.HandleFunc("/queryPage2", app.QueryPage2)         // 转至根据身份证号码查询信息页面
	http.HandleFunc("/api/query2", app.FindByID)           // 根据身份证号码查询信息
	http.HandleFunc("/modifyPage", app.ModifyShow)         // 修改信息页面
	http.HandleFunc("/modify", app.Modify)                 //  修改信息
	http.HandleFunc("/upload", app.UploadFile)

	http.HandleFunc("/api/v2/storage/data", app.FindMgeDataById)
	http.HandleFunc("/api/v2/storage/log", app.FindLogDataById)
	http.HandleFunc("/api/v2/storage/log_data", app.FindLogDataByDataId)
	http.HandleFunc("/api/v2/storage/alllog", app.FindLogData)
	http.HandleFunc("/api/v2/storage/plog", app.PAddLogData)

	http.HandleFunc("/api/v3/storage/templates", app.CreateTemplate) // createTemplate
	http.HandleFunc("/api/v1/storage/templates", app.GetAllTemplate)
	http.HandleFunc("/api/v1/storage/template", app.GetTemplateByID)

	http.HandleFunc("/api/v1.1/storage/data/full", app.AddMgeData)
	// http.HandleFunc("/api/v2/search/query/", app.Query)
	http.HandleFunc("/api/v2/search/query/", app.QueryForAddr)

	//用户登录相关
	http.HandleFunc("/api/v1/account/user/session/", app.LoginUser)
	//channel
	http.HandleFunc("/api/v1/node/joinchannel", app.HandleChannelRequest)
	http.HandleFunc("/api/v1/node/fadtrain", app.StartTrain)

	//fl相关
	http.HandleFunc("/api/v1/task/create", app.CreateTask)
	http.HandleFunc("/api/v1/task/selectDataset", app.SelectDataset)
	http.HandleFunc("/api/v1/task/handle", app.HandleTaskInvite)
	http.HandleFunc("/api/v1/task/ready", app.IsTaskReadyToStart)
	http.HandleFunc("/api/v1/task/start_multi", app.StartTask)
	http.HandleFunc("/api/v1/task/getTask", app.GetTaskByID)
	http.HandleFunc("/api/v1/task/getOrgs", app.GetOrgs)
	http.HandleFunc("/api/v1/task/getSingleResult", app.GetSingleResult)
	http.HandleFunc("/api/v1/task/getMultiResult", app.GetMultiResult)
	http.HandleFunc("/api/v1/task/getInitiateTasks", app.GetInitiateTasks)
	http.HandleFunc("/api/v1/task/getInvitedTasks", app.GetInvitedTasks)

	//http.HandleFunc("/api/storage/data")
	fmt.Println("启动Web服务, 监听端口号为: 9001")
	err := http.ListenAndServe(":9001", nil)
	if err != nil {
		fmt.Printf("Web服务启动失败: %v", err)
	}

}
