
testcase = { '7c3002ad756d76a643cb09cd45409608abb642d9' : '10', 
             '7c303333756d555643cb09cd45409608abb642d9' : '20', 
             '7c303333756d777643cb09c999409608abb642d9' : '30', 
             '7c303333756d777643cb09caaa409608abb642d9' : '40',
             '111102ad756d76a643cb09cd45409608abb642d9' : '50'}
                                                                                  
from MPT import MerklePatriciaTrie

Tests = []
Tests.append(testcase)
for Test in Tests:
    Tree = MerklePatriciaTrie()
    for item in Test:
        Tree.AddNode(item,Test[item])
    Tree.print()
