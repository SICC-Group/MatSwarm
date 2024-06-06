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
mpt.update(a.encode('utf-8'), json.dumps(test))
mpt.update(b'dataB', json.dumps(test))

# 3. get() 查询节点
temp = mpt.get(b'dataA').data
print('查询dataA节点   ', mpt.get(b'dataA'))
print('打印dataA的存储value   ', temp)
temp1 = temp.decode('utf-8')
print(temp1)

# 4. update() 更新节点
mpt.update(b'dataA', json.dumps(test) + '/div/' + json.dumps(test2))

# 5. get() 查询节点
print('更新的dataA节点:    ', mpt.get(b'dataA'))
print('更新的dataA存储的value:    ', mpt.get(b'dataA').data)

# 6. root() 返回根节点
root1 = mpt.root()

# 7. root_hash() 返回根节点的哈希值
root1hash = mpt.root_hash()

# 8. delete() 删除节点
mpt.delete(b'dataB')

print("Root hash      {}".format(root1hash.hex()))
print("New root hash {}".format(mpt.root_hash().hex()))

# 9. init() 从旧mpt的根节点提取旧mpt
mpt1 = MPT.MerklePatriciaTrie(storage, root=root1)

print('原来的MPT里查询dataB:    ', mpt1.get(b'dataB'))
print('新的MPT查询dataB: ', end='')
try:
    print(mpt.get(b'data???'))
except KeyError:
    print('????')
    pass
