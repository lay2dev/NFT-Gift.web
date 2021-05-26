import { Address, HashType, Script } from '@lay2/pw-core'
import { blake160 } from '@nervosnetwork/ckb-sdk-utils'

const config = {
  UNIPASS_TYPE_ID: process.env.NUXT_ENV_UNIPASS_TYPE_ID as string,
}
const getAddressByPubkeyHash = (pubkeyHash: string): Address => {
  const UnipassLockCodeHash = config.UNIPASS_TYPE_ID
  const lock = new Script(UnipassLockCodeHash, pubkeyHash, HashType.type)
  const address = lock.toAddress()
  return address
}
const getAddressByPubkey = (pubkey: string): Address => {
  const args = `0x${blake160(`0x${pubkey.replace('0x', '')}`, 'hex')}`
  return getAddressByPubkeyHash(args)
}

export default getAddressByPubkey
