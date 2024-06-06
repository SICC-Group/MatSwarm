from Node import node
# from ethereum import utils
from BranchNodeClass import BranchNode
from LeafNode import LeafNode

class ExtensionNode(node):

    def __init__(self,shared):
        self.prefix  = ""
        self.sharedNibble = ""
        self.hash = ""
        # 設定 sharedNibble & prefix
        self.ChangeShared(shared)
        self.nextNode = BranchNode()

        
    def printNode(self, Level):
        space = "    " * Level
        print(space,"ExtensionNode : ")
        if self.prefix == 0:
            print(space, ["00"+self.sharedNibble])
        
        elif self.prefix == 1:
            print(space,["1"+self.sharedNibble])
        self.nextNode.printNode(Level + 1)

    def Addnode(self,k,v):
        # input address 與 sharedNibble 一致 => Add node 在 branchNode下
        if self.longest(self.sharedNibble,k) ==  self.sharedNibble:
            self.nextNode.Addnode(self.rest(self.sharedNibble,k),v)
        # input address 與 sharedNibble 不一致 => 重設Extension Node並重接之前node進度
        else:
            #重設Extension Node
            currentNode = self
            # newExtensionNode作為複製current node的功能
            # (sharedNibble會再更新)
            newExtensionNode = ExtensionNode(self.sharedNibble)
            newExtensionNode.nextNode = currentNode.nextNode
            # current node 則更新成新的sharednibble, 以及接上new branch
            self.ChangeShared(self.longest(self.sharedNibble,k))
            self.nextNode = BranchNode()
            # newExtensionNode 換sharednibble，換成current node sharedNibble 剩下的部分
            # ex. old cur.share = "12345", new cur.share = "12345" => newExtensionNode.share = "345"
            newExtensionNode.ChangeShared(self.rest(self.sharedNibble,newExtensionNode.sharedNibble))
            # 但"345"並不是真正的sharednibble, 因為3會是放在branch node的index
            indexFornewExtensionNode = int(newExtensionNode.sharedNibble[0], 16)
            # sharedNibble去除index "345" => "45" 
            newExtensionNode.ChangeShared(newExtensionNode.sharedNibble[1:len(newExtensionNode.sharedNibble)]) 
            # branch node下面接上extension node
            self.nextNode.HexArray[indexFornewExtensionNode] = newExtensionNode
            # node 都接上了再接要加入的新node
            self.nextNode.Addnode(self.rest(self.sharedNibble,k),v)
        
        self.HashNode()
        return self.hash
    

    def HashNode(self):
        if self.prefix == 0:
            # print(["00"+self.sharedNibble,self.nextNode.HashNode()])
            self.hash =  self.encode_node([bytes.fromhex("00"+self.sharedNibble),self.nextNode.HashNode()])
        
        elif self.prefix == 1:
            # print(["1"+self.sharedNibble,self.nextNode.HashNode()])
            self.hash = self.encode_node([bytes.fromhex("1"+self.sharedNibble),self.nextNode.HashNode()])
        return self.hash

    def UpdateValue(self ,address,value):
        if len(self.longest(self.sharedNibble,address)) >= 0:
            return self.nextNode.UpdateValue(self.rest(self.sharedNibble,address),value)
        
        else:
            return False

    def checkExist(self,address):
        if self.longest(self.sharedNibble,address) == self.sharedNibble:
            return self.nextNode.checkExist(self.rest(self.sharedNibble,address))
        else:
            return False
        
    
    def ChangeShared(self,shared):
        self.sharedNibble = shared
        if len(self.sharedNibble)%2 == 0:
            # Leaf node with even number of keyend
            self.prefix = 0
        
        else:
            # Leaf node with odd number of keyend
            self.prefix = 1
        

# test = ExtensionNode("12")
# test.Addnode("1234","56")
# test.printNode(0)
