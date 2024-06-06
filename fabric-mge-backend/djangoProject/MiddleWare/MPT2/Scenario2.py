
Insert = { '7c3002ad756d76a643cb09cd45409608abb642d9' : '10', 
             '7c303333756d555643cb09cd45409608abb642d9' : '20', 
             '7c303333756d777643cb09c999409608abb642d9' : '30', 
             '7c303333756d777643cb09caaa409608abb642d9' : '40',
             '111102ad756d76a643cb09cd45409608abb642d9' : '50'}
            
             # Update
Update =  {
             '7c3002ad756d76a643cb09cd45409608abb642d9' : '8', 
             '7c303333756d777643cb09c999409608abb642d9' : '24', 
             '7c303333756d777643cb09caaa409608abb642d9' : '42'
             }
InsertNew = {'11113333756d76a643cb09cd45409608abb642d9' : '6'}


                                                                                  
from MPT import MerklePatriciaTrie


Tree = MerklePatriciaTrie()
for item in Insert:
    Tree.AddNode(item,Insert[item])

for item in Update:
    Tree.UpdateValue(item,Update[item])

for item in InsertNew:
    Tree.AddNode(item,InsertNew[item])

Tree.print()
