package sign

import (
	"crypto"
	"crypto/rsa"
	"crypto/sha512"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"errors"
	"fmt"
	"os"
)

// RSA签名验证
func VerifyRSA(plainText, sigText []byte, pubFileName string) bool {
	//1. 打开公钥文件 -[]byte
	file, err := os.Open(pubFileName)
	if err != nil {
		panic(err)
	}
	info, err := file.Stat()
	if err != nil {
		panic(err)
	}
	buf := make([]byte, info.Size())
	file.Read(buf)
	file.Close()
	//2. 使用pem解码 -> 得到pem.Block结构体变量
	block, _ := pem.Decode(buf)
	//3. 使用x509对pem.Block中的Bytes变量中的数据进行解析 ->  得到一接口
	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		panic(err)
	}
	//4. 进行类型断言 -> 得到了公钥结构体
	publicKey := pubInterface.(*rsa.PublicKey)
	//5. 对原始消息进行哈希运算(和签名使用的哈希算法一致) -> 散列值
	hashText := sha512.Sum512(plainText)
	//6. 签名认证 - rsa
	err = rsa.VerifyPKCS1v15(publicKey, crypto.SHA512, hashText[:], sigText)
	if err == nil {
		return true
	}
	return false
}

func getPubKey(str string) (*rsa.PublicKey, error) {
	block, err_ := pem.Decode([]byte(str))
	if block == nil {
		return nil, errors.New(string(err_))
	}
	pub, err := x509.ParsePKCS1PublicKey(block.Bytes)
	if err != nil {
		return nil, err
	}
	return pub, err
}

func Verify(text string, publicKey string, sigText string) bool {
	msgHash := sha512.New()
	_, err := msgHash.Write([]byte(text))
	hashText := msgHash.Sum(nil)
	pubKey, err := getPubKey(publicKey)
	if err != nil {
		fmt.Println(err)
	}
	sign, err := base64.StdEncoding.DecodeString(sigText)
	err = rsa.VerifyPKCS1v15(pubKey, crypto.SHA512, hashText[:], sign)
	fmt.Println("pkey")
	fmt.Println(pubKey)
	fmt.Println(hashText[:])
	if err == nil {
		fmt.Println("true")
		return true
	}
	fmt.Println(err)
	return false
}
