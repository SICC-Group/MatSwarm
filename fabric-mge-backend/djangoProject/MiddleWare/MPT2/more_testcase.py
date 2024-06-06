
# Testcase in https://github.com/ethereum/wiki/wiki/Patricia-Tree#example-trie, Root Hash = 5991bb8c6514148a29db676a14ac506cd2cd5775ace63c30a4fe457715e9ac84
# Patricia trie =
#     [ <16>, [ <>, <>, <>, <>, [ <00 6f>, [ <>, <>, <>, <>, <>, <>, [ <17>, [ <>, <>, <>, <>, <>, <>, [ <35>, 'coin' ], <>, <>, <>, <>, <>, <>, <>, <>, <>, 'puppy' ] ],
#      <>, <>, <>, <>, <>, <>, <>, <>, <>, 'verb' ] ], <>, <>, <>, [ <20 6f 72 73 65>, 'stallion' ], <>, <>, <>, <>, <>, <>, <>, <> ]
testcase1 = {'646f' : 'verb', '646f67' : 'puppy', '646f6765' : 'coin', '686f727365' : 'stallion'}

# Testcase, Root Hash = a9116924943abeddebf1c0da975ebef7b2006ede340b0f9e18504b65b52948ed
testcase2 = {'a711355' : 'case2'} #OK
# Testcase, Root Hash = 39067a59d2192dbde0af0968ba50ac88d02a41e3a9e06834e6f3490edec03cb5
testcase3 = {'a711355' : 'case2', 'a7f9365' : 'case2-2'} #OK
# Testcase, Root Hash = 608b7c482ee39d36c1aadbbf38d8d4d7a557dbe5d0484c02a44a8bdb3f87f1e6
testcase4 = {'a711355' : 'case3-1', 'a77d337' : 'case3-2', 'a7f9365' : 'case3-3'}    # Overlength
# Testcase: Root Hash = 5838ad5578f346f40d3e6b71f9a82ae6e5198dd39c52e18deec63734da512055
testcase5 = {'a711355' : '45', 'a77d337' : '1', 'a7f9365' : '2', 'a77d397' : '12'}
# Testcase, Root Hash = 0214f87faeb8417f4e5a73df8ee4aaaf904571fb9f859e2e8aa64f6f003ba3bf
testcase6 = {'a711355' : '45', 'a711356' : '46', 'a711357' : '47', 'a77d337' : '1', 'a7f9365' : '2', 'a77d397' : '12'}
# 7d337 -> 7d397 ->
from MPT import MerklePatriciaTrie

Tests = []
Tests.append(testcase1)
Tests.append(testcase2)
Tests.append(testcase3)
Tests.append(testcase4)
# Tests.append(testcase5)
# Tests.append(testcase6)
for Test in Tests:
    Tree = MerklePatriciaTrie()
    for item in Test:
        Tree.AddNode(item,Test[item])
    Tree.print()
