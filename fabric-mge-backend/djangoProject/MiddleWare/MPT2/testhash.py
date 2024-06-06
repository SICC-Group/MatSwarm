import os
import rlp
from ethereum import utils
from ethereum.utils import to_string
from ethereum.abi import is_string
import copy
from ethereum.utils import decode_hex, ascii_chr, str_to_bytes
from ethereum.utils import encode_hex
from ethereum.fast_rlp import encode_optimized
rlp_encode = encode_optimized

def encode_node( node):
        if node == BLANK_NODE:
            return BLANK_NODE
        # assert isinstance(node, list)
        rlpnode = rlp_encode(node)
        
        print(rlpnode)
        if len(rlpnode) < 32:
            return node

        hashkey = utils.sha3(rlpnode)
        print(hashkey.hex())

        return hashkey
        # print(hashkey.hex())

def encode_node2( node):
        if node == BLANK_NODE:
            return BLANK_NODE
        # assert isinstance(node, list)
        rlpnode = rlp_encode(node)
        print(rlpnode)

        hashkey = utils.sha3(rlpnode)

        # return hashkey
        print(hashkey.hex())

print("test")
BLANK_NODE = b''
BLANK_ROOT = utils.sha3rlp(b'')
# print(BLANK_ROOT)
# encode_node([bytes.fromhex('3a711355') ,b'45'])

hashD = encode_node([bytes.fromhex("201355"),b"45"])
hashC = encode_node([bytes.fromhex("209365"),b"2"])
hashB = encode_node([b"",hashD,b"",b"",b"",b"",b"",b"",b"",b"",b"",b"",b"",b"",b"",hashC,b""])
hashA = encode_node2([bytes.fromhex("00a7"),hashB])

# print(rlp.encode([bytes.fromhex("201355"),b"45"]))
