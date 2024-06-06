from Node import node
# from ethereum import utils
# from ethereum.fast_rlp import encode_optimized
# rlp_encode = encode_optimized

class LeafNode(node):

    def __init__(self,k,v):
        self.hash = ""
        self.keyEnd = ""
        self.value = ""
        self.Addnode(k,v)
        
    def printNode(self, Level):
        space = "    " * Level
        print(space,"LeafNode : ")
        if self.prefix == 2:
            print(space, ["20"+self.keyEnd,self.value])
            # self.hash  = self.encode_node([bytes.fromhex("20"+self.keyEnd),bytes(self.value, 'utf-8')]) # 偶數
        
        elif self.prefix == 3:
            print(space,["3"+self.keyEnd,self.value])
            # self.hash  = self.encode_node([bytes.fromhex("3"+self.keyEnd),bytes(self.value, 'utf-8')]) # 奇數

    def Addnode(self,k,v):
        if len(k)%2 == 0:
            # Leaf node with even number of keyend
            self.prefix = 2
        else:
            # Leaf node with odd number of keyend
            self.prefix = 3
        self.keyEnd = k
        self.value = v
        self.HashNode()
        return self.hash

    def HashNode(self):
        if self.prefix == 2:
            # print([bytes.fromhex("20"+self.keyEnd),self.value])
            self.hash  = self.encode_node([bytes.fromhex("20"+self.keyEnd),bytes(self.value, 'utf-8')]) # 偶數
        
        elif self.prefix == 3:
            # print([bytes.fromhex("3"+self.keyEnd),self.value])
            self.hash  = self.encode_node([bytes.fromhex("3"+self.keyEnd),bytes(self.value, 'utf-8')]) # 奇數
        return self.hash


    def UpdateValue(self ,address,value):
        if address == self.keyEnd:
            self.value = value
            self.HashNode()
            return True
        else:
            return False

    def checkExist(self, address):
        if self.keyEnd == address:
            return True
        else:
            return False

    def UpdateKeyEnd(self ,k):
        self.keyEnd = k
        self.HashNode()
    
    def gethash(self):
        return self.hash


# test = LeafNode("a711355","45")
# print(test.__class__)
# print(test.__class__ == LeafNode)
# test.printNode(1)
# print(test.hash)