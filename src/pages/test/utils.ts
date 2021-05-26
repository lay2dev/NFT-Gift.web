import { Address, HashType, Script } from '@lay2/pw-core'
import { blake160 } from '@nervosnetwork/ckb-sdk-utils'
const config = {
  UNIPASS_TYPE_ID: import.meta.env.VITE_UNIPASS_TYPE_ID,
}
console.log(config)
function getAddressByPubkeyHash(pubkeyHash: string): Address {
  const UnipassLockCodeHash = config.UNIPASS_TYPE_ID
  const lock = new Script(UnipassLockCodeHash, pubkeyHash, HashType.type)
  const address = lock.toAddress()
  return address
}

export default function getAddressByPubkey(pubkey: string): Address {
  console.log(config)
  const args = '0x' + blake160('0x' + pubkey.replace('0x', ''), 'hex')
  return getAddressByPubkeyHash(args)
}
