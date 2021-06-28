import '~/assets/js/bigsea'
import dayjs from 'dayjs'
import PWCore, { Address, ChainID } from '@lay2/pw-core'
import { getPacketRandomList } from 'assets/js/nft/utils'
import { ActionType } from 'assets/js/url/interface'
import {
  restoreState,
  getDataFromUrl,
  getPubkey,
  saveState,
} from 'assets/js/url/state-data'
import {
  getDataFromSignString,
  getKeyPassword,
  getPubkeyHash,
  generateKey,
} from '~/assets/js/nft/utils'
import { getSecondaryAuth, serializeLocalAuth } from '~/assets/js/nft/auth-item'

// global variable utils Sea
PWCore.chainId =
  process.env.CKB_CHAIN_ID === '0' ? ChainID.ckb : ChainID.ckb_testnet
Sea.Ajax.HOST = process.env.NFT_GIFT
Sea.checkLogin = () => {
  const provider = Sea.localStorage('provider')
  if (provider && provider._address) {
    const passed = dayjs().diff(dayjs(provider._time || 0), 'hour')
    if (passed > 6) {
      Sea.localStorage('provider', '')
    } else {
      provider._time = Date.now()
      Sea.localStorage('provider', provider)
      return provider
    }
  }
  return null
}
Sea.bindLogin = async () => {
  // todo
  const provider = await Sea.checkLogin()
  if (provider) {
    return provider
  }
  const host = process.env.UNIPASS_URL
  const successUrl = new URL(window.location.href).href
  const failUrl = new URL(window.location.href).href
  const url = `${host}?success_url=${successUrl}&fail_url=${failUrl}/#login`
  saveState(ActionType.Init)
  window.location.href = url
}

Sea.SaveDataByUrl = () => {
  const pageState = restoreState(true)
  let action = ActionType.Init
  if (pageState) action = pageState.action
  console.log('pageState', pageState)
  if (action === ActionType.Init) {
    const info = getDataFromUrl(ActionType.Login)
    return info
  } else if (action === ActionType.SignMsg) {
    const info = getDataFromUrl(ActionType.SignMsg)
    return Sea.getSignData(info)
  } else if (action === ActionType.CancelSignMsg) {
    const info = getDataFromUrl(ActionType.CancelSignMsg)
    return Sea.getCancleSignData(info)
  }
}
// sign
const _redPacketCreate = async ({ password, nfts, redPackeNumber }) => {
  const redPacket = []
  const localAuth = []
  const newNfts = getPacketRandomList(redPackeNumber, nfts)
  for (const itemNFTs of newNfts) {
    const outpoints = []
    const nftTypeArgs = []
    const { pubkey, pem } = await generateKey('generateKey', password)
    for (const item of itemNFTs) {
      outpoints.push({
        index: item.outPoint.index.toString(16),
        txHash: item.outPoint.txHash,
      })
      nftTypeArgs.push(item.nftTypeArgs)
    }
    const data = {
      encrypt: pem,
      keyPubkey: pubkey,
      outpoints: JSON.stringify(outpoints),
      outpointSize: itemNFTs.length,
      nftTypeArgs: nftTypeArgs.join(','),
    }
    redPacket.push(data)
    localAuth.push({
      pubkeyHash: getPubkeyHash(pubkey),
      outpoints,
    })
  }
  const authItemsBuffer = serializeLocalAuth(localAuth)
  const authItemsHex = `0x${authItemsBuffer.toString('hex')}`
  return {
    redPacket,
    authItemsHex,
  }
}
const _redPacketSign = (
  message,
  redPacket,
  password,
  address,
  pin,
  question,
) => {
  const host = process.env.UNIPASS_URL
  const successUrl = new URL(window.location.href).href
  const failUrl = new URL(window.location.href).href
  const pubkey = getPubkey()
  if (!pubkey) return
  const _url = `${host}?success_url=${successUrl}&fail_url=${failUrl}&pubkey=${pubkey}&message=${message}/#sign`
  saveState(
    ActionType.SignMsg,
    JSON.stringify({ message, redPacket, password, address, pin, question }),
  )
  console.log(_url)
  window.location.href = _url
}
Sea.cancleSign = (data, message) => {
  const host = process.env.UNIPASS_URL
  const successUrl = new URL(window.location.href).href
  const failUrl = new URL(window.location.href).href
  const pubkey = getPubkey()
  if (!pubkey) return
  const _url = `${host}?success_url=${successUrl}&fail_url=${failUrl}&pubkey=${pubkey}&message=${message}/#sign`
  saveState(ActionType.CancelSignMsg, JSON.stringify(data))
  console.log(_url)
  window.location.href = _url
}

Sea.getSignData = (info) => {
  const pageState = restoreState()
  const extraObj = pageState.extraObj
  console.log('[[[[pageState]]]]', pageState)
  if (extraObj && pageState.data.signature) {
    const { message, redPacket, password, address, pin, question } =
      JSON.parse(extraObj)
    const sign = getDataFromSignString(pageState.data.signature)
    const { masterkey, authorization, localKey, sig } = sign
    const { authSig, authInfo } = getSecondaryAuth(localKey, message, sig)
    const data = {
      authorization,
      masterKeyPubkey: masterkey,
      localKeyPubkey: localKey,
      localKeySig: authSig,
      localAuthInfo: authInfo,
      redPacket,
      password,
      fromAddress: address,
      pin,
      question,
    }
    return data
  }
  return { info }
}
Sea.getCancleSignData = (info) => {
  const pageState = restoreState()
  const extraObj = pageState.extraObj
  if (extraObj && pageState.data.signature) {
    const { id, fromAddress, messageHash } = JSON.parse(extraObj)
    const data = {
      sig: '0x01' + pageState.data.signature.replace('0x', ''),
      id,
      fromAddress,
      messageHash,
    }
    return data
  }
  return { info }
}

Sea.bindSign = async ({
  nfts,
  password,
  address,
  redPackeNumber,
  question,
}) => {
  const { redPacket, authItemsHex } = await _redPacketCreate({
    password,
    nfts,
    redPackeNumber,
  })
  await _redPacketSign(
    authItemsHex,
    redPacket,
    getKeyPassword(password),
    address,
    password,
    question,
  )
  // return {
  //   authorization: sign.authorization,
  //   masterKeyPubkey: sign.masterkey,
  //   localKeyPubkey: sign.localKey,
  //   localKeySig: sign.authSig,
  //   localAuthInfo: sign.authInfo,
  //   redPacket,
  //   password,
  //   fromAddress: address,
  // }
}
