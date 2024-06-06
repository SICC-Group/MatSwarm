import metrohash
from Crypto.Hash import keccak

test = metrohash.MetroHash128()
test.update('test')
test.update('test2')
print(test.intdigest())

test2 = metrohash.MetroHash128()
test2.update('testtest2')
print(test2.intdigest())

a = keccak.new(digest_bits=256)
a.update(b'test')
a.update(b'test2')
print(a.digest())

b = keccak.new(digest_bits=256)
b.update(b'testtest2')
print(b.digest())

