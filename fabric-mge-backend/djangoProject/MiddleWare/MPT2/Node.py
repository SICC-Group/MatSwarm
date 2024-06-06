import abc
import os

import eth_hash
import rlp

# from ethereum import utils
# from ethereum.utils import to_string
# from ethereum.abi import is_string
# import copy
# from ethereum.utils import decode_hex, ascii_chr, str_to_bytes
# from ethereum.utils import encode_hex
# from ethereum.fast_rlp import encode_optimized
# rlp_encode = encode_optimized
rlp_encode = rlp.encode  # me


class node(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def printNode():
        return NotImplemented

    @abc.abstractmethod
    def Addnode():
        return NotImplemented

    @abc.abstractmethod
    def UpdateValue():
        return NotImplemented

    @abc.abstractmethod
    def checkExist():
        return NotImplemented

    def encode_node(self, node):
        # if node == BLANK_NODE:
        #     return BLANK_NODE
        rlpnode = rlp_encode(node)

        # print(rlpnode)
        if len(rlpnode) < 32:
            return node

        # hashkey = utils.sha3(rlpnode)
        hashkey = eth_hash.Keccak256(rlpnode)  # me
        # print(hashkey.hex())
        return hashkey

    def longest(self, a, b):
        sub = ""
        for i in range(len(a)):
            if a[i] == b[i]:
                sub += a[i]
            else:
                break
        return sub

    def rest(self, sub, origin):
        temp = ""
        for i in range(len(sub), len(origin)):
            temp += origin[i]
        return temp
