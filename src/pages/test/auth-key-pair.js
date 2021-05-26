import { signMessage } from './utils'

function serializeLocalAuth(localAuth) {
  const size = localAuth.length
  const sizeBuffer = Buffer.alloc(4)
  sizeBuffer.writeUInt32LE(size, 0)
  let buffer = sizeBuffer
  for (const authItem of localAuth) {
    buffer = Buffer.concat([buffer, serializeAuthItem(authItem)])
  }
  return buffer
}
function serializeOutpoints(outpoints) {
  let buffer
  const outpoint_size = outpoints.length
  const sizeBuffer = Buffer.alloc(4)
  sizeBuffer.writeUInt32LE(outpoint_size, 0)
  buffer = sizeBuffer
  for (const outpoint of outpoints) {
    const outpointBuffer = serializeOutpoint(outpoint)
    buffer = Buffer.concat([buffer, outpointBuffer])
  }

  return buffer
}
function serializeAuthItem(authItem) {
  const { pubkeyHash, outpoints } = authItem
  const outpointsBuffer = serializeOutpoints(outpoints)
  return Buffer.concat([
    Buffer.from(pubkeyHash.replace('0x', ''), 'hex'),
    outpointsBuffer,
  ])
}

function serializeOutpoint(outpoint) {
  const { txHash, index } = outpoint
  const hashBuffer = Buffer.from(txHash.replace('0x', ''), 'hex')
  const indexBuffer = Buffer.alloc(4)
  indexBuffer.writeUInt32LE(Number(index), 0)

  const outpointBuffer = Buffer.concat([hashBuffer, indexBuffer])
  return outpointBuffer
}

export async function getSecondaryAuth(localKey, localPubkey, localAuthInfo) {
  const authItemsBuffer = serializeLocalAuth(localAuthInfo)
  const authItemsHex = `0x${authItemsBuffer.toString('hex')}`
  const sig = signMessage(localKey, authItemsHex)
  const authSig = Buffer.concat([
    Buffer.from(localPubkey.replace('0x', ''), 'hex'),
    Buffer.from(sig.replace('0x', ''), 'hex'),
  ])
  return {
    authSig: `0x${authSig.toString('hex')}`,
    authInfo: authItemsHex,
  }
}
