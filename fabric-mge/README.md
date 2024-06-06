前提

```md
go语言的环境最好使用mod管理,使用go 1.18版本
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.io,direct
```

在目录中随便拉取项目

```
git clone https://gitee.com/dongrunshi/fabric-mge.git
```
然后
```
git checkout origin/fabric-mge1.0 
```

在`/etc/hosts`中添加：

```
127.0.0.1  orderer.example.com
127.0.0.1  peer0.org1.example.com
127.0.0.1  ca.org1.example.com
127.0.0.1  peer0.org2.example.com
127.0.0.1  ca.org2.example.com
```



当前项目中路径都是绝对路径，你需要修改代码中logger包下 logger.go中的路径,就是创建一个go.log文件,将当前路径替换一下

```bash
logger.go
/home/drs/codes/logs/go.log   替换成   pwd你当前路径/go.log

```

添加依赖：

```
cd fabric-mge && go mod tidy
```


运行项目(一定要在main.go目录下,也就是你运行main.go的目录下运行：

```
./clean_docker.sh 
go build main.go

```
为链码添加依赖(cd chaincode/）：
```
go mod tidy
go mod vendor

```


```bash
./main InitBlock   #初始化区块链,正常一条龙服务，第一次生成docker容器的时候需要使用这个命令启动
./main NotInitBlock #直接启动web服务器,在有区块链网路的情况下使用这个命令启动
```


`注意`

可能会遇到一种报错就是clientxxx函数找不到，可能是依赖版本太高了，有些函数没了

```mod
将github.com/hyperledger/fabric-protos-go这一行替换成下面一行再 go mod tidy
github.com/hyperledger/fabric-protos-go v0.0.0-20210311171918-e08edaab0493
```

还有可能虚拟机重新启动了，需要重新启动docker，直接运行下面的命令
```bash
sudo ./start_docker.sh
```

启动时出现报错
```bash
>> 开始创建通道......
>> Create channel and join error: Create channel error: error should be nil for SaveChannel of orgchannel: create channel failed: create channel failed: SendEnvelope failed: calling orderer 'orderer.example.com:7050' failed: Orderer Client Status Code: (2) CONNECTION_FAILED. Description: dialing connection on target [orderer.example.com:7050]: connection is in TRANSIENT_FAILURE。
```
原因：docker未成功启动
解决方案：运行./clean_docker.sh时加上sudo
```bash
sudo ./clean_docker.sh
```