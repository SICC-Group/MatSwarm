import eth_hash

from Node import node

from BranchNodeClass import BranchNode
from ExtensionNodeClass import ExtensionNode
from LeafNode import LeafNode
import os
import rlp

# from ethereum import utils
# from ethereum.utils import to_string
# from ethereum.abi import is_string
# import copy
# from ethereum.utils import decode_hex, ascii_chr, str_to_bytes
# from ethereum.utils import encode_hex
# from ethereum.fast_rlp import encode_optimized
# rlp_encode = encode_optimized
rlp_encode = rlp.encode  # me


class MerklePatriciaTrie:

    def __init__(self):
        self.root = None
        self.roothash = ""

    def AddNode(self, address, value):
        # check if root is null
        if self.root == None:
            self.root = LeafNode(address, value)
            return

        # check if the node exist or not
        # if exist then can not add node can only update
        if self.checkExist(address):
            print("self node is already exist")
            return

        # 若現在node是 leaf node => 換頭成extension
        if self.root.__class__ == LeafNode:
            subaddress = self.longest(self.root.keyEnd, address)
            tempExtension = ExtensionNode(subaddress)
            tempExtension.Addnode(address, value)
            tempExtension.Addnode(self.root.keyEnd, self.root.value)
            self.root = tempExtension

        # 若現在node是 Branch node => 直接加
        elif self.root.__class__ == BranchNode:
            self.root.Addnode(address, value)

        # 若現在node是 Extension node
        elif self.root.__class__ == ExtensionNode:
            # 如果第一個address char就一樣就直接加
            # 如果sharedNibble沒有完全一樣extension addnode會判斷並處理
            if self.root.sharedNibble[0] == address[0]:
                self.root.Addnode(address, value)

            else:
                # 如果第一個address char就不一樣 root要換成Branch node
                # 因為要換root 所以不放在extension node 處理放在MPT處理
                tempBranch = BranchNode()
                index = int(self.root.sharedNibble[0])
                self.root.ChangeShared(self.root.sharedNibble[1:len(self.root.sharedNibble)])
                # self.root.sharedNibble = self.root.sharedNibble[1:len(self.root.sharedNibble)]
                tempBranch.HexArray[index] = self.root
                tempBranch.Addnode(address, value)
                self.root = tempBranch

        # self.root.printNode(0)

    def checkExist(self, address):
        return self.root.checkExist(address)

    def UpdateValue(self, address, value):
        if not self.checkExist(address):
            print("self node is not exist")
            return

        Result = self.root.UpdateValue(address, value)
        self.root.HashNode()
        return Result

    def print(self):
        temp = self.root
        temp.printNode(0)
        # print(self.root.HashNode().hex())
        if type(self.root.hash) == bytes:
            self.roothash = self.root.hash.hex()
            # print(self.root.hash)
        else:
            self.roothash = self.encode_node(self.root.HashNode())
            # print(self.roothash)
            self.roothash = self.roothash.hex()

        print(self.roothash)

    def encode_node(self, node):
        # if node == BLANK_NODE:
        #     return BLANK_NODE
        rlpnode = rlp_encode(node)

        # print(rlpnode)
        # if len(rlpnode) < 32:
        #     return node
        # hashkey = utils.sha3(rlpnode)
        hashkey = eth_hash.Keccak256(rlpnode)  # me
        # print(hashkey.hex())
        return hashkey

    def longest(self, a, b):
        sub = ""
        for i in range(len(a)):
            if a[i] == b[i]:
                sub += a[i]
            else:
                break
        return sub

    def rest(self, sub, origin):
        temp = ""
        for i in range(len(sub)):
            temp += origin[i]
        return temp

    # list():
    #     result = self.root.list(true)
    #     jsonResult = JSON.stringify(self.root.list(false))
    #     console.loggger.py(jsonResult)
    #     # console.loggger.py(SHARLP(result))
    #     # console.loggger.py(typeof(self.root.hash))
    #     if typeof(self.root.hash) != typeof("string"):
    #         self.roothash = hashignore32(self.root.hash)

    #     else{
    #         self.roothash = self.root.hash

    #     console.loggger.py("ROOTHASH :　",self.roothash)
