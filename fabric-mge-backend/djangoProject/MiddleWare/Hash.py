from Crypto.Hash import keccak
import metrohash

def keccak_hash(data):
    keccak_hash = keccak.new(digest_bits=256)
    keccak_hash.update(data)
    return keccak_hash.digest()
    # metro = metrohash.MetroHash64()
    # metro.update(data)
    # return metro.digest()
