package sign

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"os"
)

// 生成RSA私钥和公钥
// bits 证书位数，示例2048 saveDir 保存目录
func GenerateRSAKey(bits int, saveDir string) error {
	privateKey, err := rsa.GenerateKey(rand.Reader, bits)
	if err != nil {
		return err
	}
	x509PrivateKey := x509.MarshalPKCS1PrivateKey(privateKey)
	privateFile, err := os.Create(saveDir + "/private.pem")
	if err != nil {
		return err
	}
	defer func() {
		_ = privateFile.Close()
	}()
	privateBlock := pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509PrivateKey}
	err = pem.Encode(privateFile, &privateBlock)
	if err != nil {
		return err
	}
	publicKey := privateKey.PublicKey
	X509PublicKey, err := x509.MarshalPKIXPublicKey(&publicKey)
	if err != nil {
		return err
	}
	publicFile, err := os.Create(saveDir + "/public.pem")
	if err != nil {
		return err
	}
	defer func() {
		_ = publicFile.Close()
	}()
	publicBlock := pem.Block{Type: "RSA PUBLIC KEY", Bytes: X509PublicKey}
	err = pem.Encode(publicFile, &publicBlock)
	return err
}

// RSA加密
// content 要加密的内容 pubKey 公钥
func RSAEncrypt(content string, pubKey []byte) (string, error) {
	block, _ := pem.Decode(pubKey)
	publicKeyInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return "", err
	}
	publicKey := publicKeyInterface.(*rsa.PublicKey)
	cipherText, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey, []byte(content))
	if err != nil {
		return "", err
	}
	return string(cipherText), nil
}

// RSA解密
// cipherText 密文 privateKey 私钥
func RSADecrypt(cipherText string, privateKey []byte) (string, error) {
	block, _ := pem.Decode(privateKey)
	priKey, err := x509.ParsePKCS1PrivateKey(block.Bytes)
	if err != nil {
		return "", err
	}
	plainText, err := rsa.DecryptPKCS1v15(rand.Reader, priKey, []byte(cipherText))
	if err != nil {
		return "", nil
	}
	return string(plainText), nil
}

//签名
func SignPKCS1v15(privateKeypem []byte, src []byte, hash crypto.Hash) ([]byte, error) {
	privateBlock, _ := pem.Decode(privateKeypem)
	if privateBlock == nil {
		panic("private key error")
	}

	privateKey, err := x509.ParsePKCS1PrivateKey(privateBlock.Bytes)
	if err != nil {
		panic("privateKey is not  *rsa.PrivateKey")
	}
	h := hash.New()
	h.Write(src)
	hashed := h.Sum(nil)
	return rsa.SignPKCS1v15(rand.Reader, privateKey, hash, hashed)
}

//验证
func VerifyPKCS1v15Verify_(publicKeypem []byte, src []byte, sign []byte, hash crypto.Hash) error {
	publicBlock, _ := pem.Decode([]byte(publicKeypem))
	if publicBlock == nil {
		panic("public key error")
	}
	pub, err := x509.ParsePKIXPublicKey(publicBlock.Bytes)
	if err != nil {
		panic("publicKey is not  *rsa.PublicKey")
	}
	publicKey := pub.(*rsa.PublicKey)
	h := hash.New()
	h.Write(src)
	hashed := h.Sum(nil)
	return rsa.VerifyPKCS1v15(publicKey, hash, hashed, sign)
}

func main() {
	var PubKey []byte
	var PriKey []byte
	file := "public.pem"
	PubKey, _ = ioutil.ReadFile(file) //使用ioutil.ReadFile一次将文件读取到内存中
	//PubKey, _ = efs.ReadFile("test16/crypto_public_key.pem")
	file = "private.pem"
	PriKey, _ = ioutil.ReadFile(file) //使用ioutil.ReadFile一次将文件读取到内存中
	encrypt, err := RSAEncrypt("你是谁", PubKey)
	if err != nil {
		return
	}
	fmt.Printf("%x\n", encrypt)
	decrypt, err := RSADecrypt(encrypt, PriKey)
	if err != nil {
		return
	}
	fmt.Println(decrypt)

	//签名 和验证
	signBytes, err := SignPKCS1v15(PriKey, []byte("abc"), crypto.SHA256)
	if err != nil {
		fmt.Println("SignPKCS1v15 error")
	}

	fmt.Printf("签名:%x\n", signBytes)
	fmt.Println("SignPKCS1v15 base64:" + base64.StdEncoding.EncodeToString(signBytes))

	//-----验证签名
	err = VerifyPKCS1v15Verify_(PubKey, []byte("abc"), signBytes, crypto.SHA256)
	if err == nil {
		fmt.Println("VerifyPKCS1v15Verify oaky")
	}
}
