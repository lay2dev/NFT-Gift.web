import {
  Address,
  Blake2bHasher,
  CellDep,
  DepType,
  getDefaultPrefix,
  Hasher,
  HashType,
  OutPoint,
  Reader,
  Script,
} from '@lay2/pw-core'
import forge from 'node-forge'

interface UnipassData {
  masterkey: string
  authorization: string
  localKey: string
}

export const UNIPASS_TYPE_ID =
  '0x949db47aac7d1a2a0d921344dc5c1ddefda390813a1881d56a0872d798e0d629'
export const NODE_URL = 'https://testnet.ckb.dev'
export const INDEXER_URL = 'https://testnet.ckb.dev/indexer'
export const rsaDep = new CellDep(
  DepType.code,
  new OutPoint(
    '0xd7022ca7f883ffa7e067bf0ecd945fefa49b3a0c82d3edb6939f976b53a6069f',
    '0x0',
  ),
)
export const acpDep = new CellDep(
  DepType.code,
  new OutPoint(
    '0x363b22a0de38c31e83fb83fa7210c447a4861408f1c56502f545cfffda25d9cc',
    '0x0',
  ),
)
export const unipassDep = new CellDep(
  DepType.code,
  new OutPoint(
    '0x01e18325376c649237a41b2d79f32bc793c51d25dfa250f2611161042e71f942',
    '0x0',
  ),
)
export function getPubkeyHash(pubkey: string) {
  const blake2b: Hasher = new Blake2bHasher()
  blake2b.update(new Reader(`0x${pubkey.replace('0x', '')}`))
  return blake2b.digest().serializeJson()
}

/**
 * get ckb address by pubkey
 * @param pubkey
 */
export function getAddressByPubkey(pubkey: string): string {
  const pubKeyBuffer = Buffer.from(pubkey.replace('0x', ''), 'hex')
  const hashHex = new Blake2bHasher()
    .update(pubKeyBuffer.buffer)
    .digest()
    .serializeJson()
    .slice(0, 42)
  let script = new Script(UNIPASS_TYPE_ID, hashHex, HashType.type)
  return script.toAddress(getDefaultPrefix()).toCKBAddress()
}
/**
 * decrypt pubukey to cryptoKey
 */
export async function decryptMasterKey(
  masterKey: string,
  salt: string,
  password: string,
): Promise<CryptoKey> {
  const strongPass = forge.pkcs5.pbkdf2(password, salt, 2 ** 16, 16)
  const privkey = forge.pki.decryptRsaPrivateKey(masterKey, strongPass)

  // convert to pkcs8 format pem, refer to https://github.com/digitalbazaar/forge/issues/109#issuecomment-38009619
  const rsaPrivateKey = forge.pki.privateKeyToAsn1(privkey)
  const privateKeyInfo = forge.pki.wrapRsaPrivateKey(rsaPrivateKey)
  const pem = forge.pki
    .privateKeyInfoToPem(privateKeyInfo)
    .replace(/\r/g, '')
    .replace(/\n/g, '')

  // // converts a forge 0.6.x string of bytes to an ArrayBuffer
  const pemHeader = '-----BEGIN PRIVATE KEY-----'
  const pemFooter = '-----END PRIVATE KEY-----'
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length,
  )
  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents)
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString)

  return await window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  )
}

function str2ab(str: string) {
  const b = new ArrayBuffer(str.length)
  const view = new Uint8Array(b)
  for (let i = 0; i < str.length; ++i) {
    view[i] = str.charCodeAt(i)
  }
  return b
}
function ab2str(buf: ArrayBuffer) {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)))
}

/**
 * one nft data create one kay par (key.private kay key.publick key)
 */
export async function generateKey(salt: string, password: string) {
  // create RSA key
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign', 'verify'],
  )

  // get public key
  const pubkeyJWK = await window.crypto.subtle.exportKey('jwk', key.publicKey)
  if (!pubkeyJWK.e || !pubkeyJWK.n) {
    throw new Error('pubkey generation failed')
  }

  const nA = Buffer.from(pubkeyJWK.n, 'base64').reverse()
  const eA = Buffer.alloc(4)
  const sA = Buffer.alloc(4)
  eA.writeUInt32LE(65537, 0)
  sA.writeUInt32LE(nA.length * 8, 0)

  const pubkey = Buffer.concat([sA, eA, nA]).toString('hex')
  // generate pem from private key
  let pkcs8: ArrayBuffer | null = await window.crypto.subtle.exportKey(
    'pkcs8',
    key.privateKey,
  )
  const exportedAsString = ab2str(pkcs8)
  const exportedAsBase64 = window.btoa(exportedAsString)
  const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`
  pkcs8 = null
  const strongPass = forge.pkcs5.pbkdf2(password, salt, 2 ** 16, 16)
  const rsaKey = forge.pki.privateKeyFromPem(pemExported)
  const pem = forge.pki.encryptRsaPrivateKey(rsaKey, strongPass, {
    algorithm: 'aes256',
  })
  console.log('[master key pem', pem)
  return { key, pubkey, pem }
}

/**
 * from unipass sign data get masterkey authorization localKey and this data will push to service
 * @param signstr unipass sign data
 */
export function getDataFromSignString(signstr: string): UnipassData {
  signstr = signstr.replace('0x', '')
  const masterkey = signstr.substr(0, 528)
  const authorization = signstr.substring(528, 1040)
  const localKey = signstr.substring(1040, 1586)
  return { masterkey, authorization, localKey }
}
/**
 * this keyPass will push to server
 */
export function getKeyPassword(password: string) {
  const hmac = forge.hmac.create()
  hmac.start('sha256', password)
  hmac.update('getKeyPassword')
  const keyPass = hmac.digest().toHex()
  return keyPass
}