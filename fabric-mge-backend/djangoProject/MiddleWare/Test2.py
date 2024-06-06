import json
import MPT

# storage = {
#     'a': 'a'
# }
storage = {}

# 1. init() 构造树
mpt = MPT.MerklePatriciaTrie(storage)

test = {
    'id': 789,
    'title': 'test',
    'content': {
        'A': 'a'
    }
}
test2 = {
    'id': 780,
    'title': 'test2',
    'content': {
        'A': 'b'
    }
}

a = 'dataA'
# 2. update() 添加节点
mpt.update_mge(a.encode('utf-8'), json.dumps(test))
mpt.update_mge(b'dataB', json.dumps(test))
print(mpt.get(b'dataA').data)
print(mpt.get(b'dataB').data)
mpt.update_mge(b'dataA', json.dumps(test2))
print(mpt.get(b'dataA').data)



