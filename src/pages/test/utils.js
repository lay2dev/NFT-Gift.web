export async function signMessage(key, msg) {
  const sig = await window.crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    Buffer.from(msg.replace('0x', ''), 'hex').buffer,
  )
  return Buffer.from(sig).toString('hex')
}

export function getAddressByPubkey(pubkey) {
  const args = '0x' + blake160('0x' + pubkey.replace('0x', ''), 'hex')
  return getAddressByPubkeyHash(args)
}

function getAddressByPubkeyHash(pubkeyHash) {
  const UnipassLockCodeHash = this.config.get < string > 'UNIPASS_TYPE_ID'
  const lock = new Script(UnipassLockCodeHash, pubkeyHash, HashType.type)
  const address = lock.toAddress()
  return address
}
