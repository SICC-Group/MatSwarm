import rsa
import hashlib


def CreateSHA(message):
    # (pubkey, privkey) = rsa.newkeys(1024)
    # pub = pubkey.save_pkcs1()
    # pubfile = open('public.pem', 'w+')
    # pubfile.write(pub.decode('utf-8'))
    # pubfile.close()
    # pri = privkey.save_pkcs1()
    # prifile = open('private.pem', 'w+')
    # prifile.write(pri.decode('utf-8'))
    # prifile.close()
    # with open("public.pem", "rb") as publickfile:
    with open(r"D:\Pycharm\SCode\fabric-mge-backend\fabric-mge-backend\apps\storage\sign\public.pem", "rb") as publickfile:
        p = publickfile.read()
        pubkey = rsa.PublicKey.load_pkcs1(p)
        pubkey_str = p.decode('utf-8')
        # print(pubkey)
    # with open('private.pem', "rb") as privatefile:
    with open(r'D:\Pycharm\SCode\fabric-mge-backend\fabric-mge-backend\apps\storage\sign\private.pem', "rb") as privatefile:
        p = privatefile.read()
        privkey = rsa.PrivateKey.load_pkcs1(p)
        # print(privkey)
    # 签名
    signature = rsa.sign(message.encode('utf-8'), privkey, 'SHA-512')
    # pubkey_url = 'http://localhost:8000/static/public.pem'
    pubkey_url = pubkey.save_pkcs1('PEM')
    return [signature, pubkey_str]

# 验证
# print(rsa.verify(message, signature, pubkey))

