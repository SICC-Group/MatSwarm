from Node import node
from LeafNode import LeafNode
# from ethereum import utils

class BranchNode(node):

    def __init__(self):
        self.HexArray = [""] * 16
        self.value = ""
        self.hash = ""
        
    def printNode(self, Level):
        space = "    " * Level
        print(space,"BranchNode : ")

        for index in range(16):
            if self.HexArray[index] != "":
                print(space ,index)
                self.HexArray[index].printNode(Level + 1)
        print(space,self.value)
            

    def Addnode(self,k,v):
        # 若k = ""，表示是到extension node address就沒了
        # 該extension node value記在 branch node 下
        if k == "":
             self.value = v
             return
        index = int(k[0], 16)
        # 延遲import 防止circular import
        from ExtensionNodeClass import ExtensionNode
        if self.HexArray[index] != "":
            # 若目前是LEAF
            if self.HexArray[index].__class__ == LeafNode:
                # 先把目前Leaf存下來
                Leaf = self.HexArray[index]
                # 找出目前Leaf 與新增的node之間最長的substring
                # if Leaf.keyEnd[0] != str(index):############### idk why?
                    # Leaf.keyEnd = str(index) + Leaf.keyEnd##########idk why?
                subaddress = self.longest(Leaf.keyEnd,k[1:len(k)])
                # 創extensionnode
                tempExtension = ExtensionNode(subaddress[0:len(subaddress)])
                # extensionNode 下的Branch Node加入新增node
                tempExtension.Addnode(k[1:len(k)],v)
                # extensionNode 下的Branch Node加入已存在的Leaf 不用做substring
                tempExtension.Addnode(Leaf.keyEnd[0:len(Leaf.keyEnd)],Leaf.value)
                # HexArray 內容從Leaf換成 ExtensionNode
                self.HexArray[index] = tempExtension
            # 若目前是ExtensionNode
            elif self.HexArray[index].__class__ == ExtensionNode:
                self.HexArray[index].Addnode(k[1:len(k)],v)
            
        
        else:
            self.HexArray[index] = LeafNode(k[1:len(k)],v)
        
        # 不確定要不要hash，還是要call 的時候再hash就好了
        self.HashNode()
        return self.hash

    def HashNode(self):
        # rlp and hash need byte format
        arr = [b""]*17
        for index in range(16):
            # check if has node inside
            if self.HexArray[index] != "":
                arr[index] = self.HexArray[index].HashNode()
            
        
        if self.value != "":
            arr[16] = bytes(self.value, 'utf-8')
        # print(arr)
        
        self.hash = self.encode_node(arr)
        return self.hash


    def UpdateValue(self ,address,value):
        index = int(address[0], 16)
        if self.HexArray[index] != "":
            return self.HexArray[index].UpdateValue(address[1:len(address)],value)
        else:
            return False
        
    def checkExist(self, address):
        index = int(address[0], 16)
        if self.HexArray[index] != "":
            return self.HexArray[index].checkExist(address[1:len(address)])
        else:
            return False



# test = BranchNode()
# test.Addnode("123","45")
# test.Addnode("233","67")
# test.printNode(0)
# print(test.HashNode())