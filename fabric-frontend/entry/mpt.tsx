import { BaseTrie as Trie } from 'merkle-patricia-tree'
import { Proof } from 'merkle-patricia-tree/dist/baseTrie'

function HexToBuffer(hex: any) {
  return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h: any) {
    return parseInt(h, 16)
  }))
}

export async function VerifyVO(clientVO: any) {
  let key = clientVO.key
  let voMap = clientVO.voMap
  for (let category in voMap){
    console.log("test")
    console.log(category)
    let temp = voMap[category]
    let voChain = HexToBuffer(temp.voChain)
    console.log(voChain)
    console.log(Buffer.from(voChain))
    let originProof = HexToBuffer(temp.proof)
    let proof :Proof = [Buffer.from(originProof)]
    const value = await Trie.verifyProof(Buffer.from(voChain),Buffer.from(key), proof)
    console.log(value)
  }
}