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
import UnipassProvider from '~/assets/js/UnipassProvider.ts'
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
  const successUrl = window.location.origin
  const failUrl = window.location.origin
  const url = `${host}?success_url=${successUrl}&fail_url=${failUrl}/#login`
  saveState(ActionType.Init)
  window.location.href = url
}

Sea.SaveDataByUrl = (address, email) => {
  if (address) {
    const provider = new UnipassProvider()
    provider._time = Date.now()
    provider._address = new Address(address)
    provider._email = email || ''
    Sea.localStorage('provider', provider)
  } else {
    const pageState = restoreState(true)
    let action = ActionType.Init
    if (pageState) action = pageState.action
    if (action === ActionType.Init) {
      getDataFromUrl(ActionType.Login)
    } else if (action === ActionType.SignMsg) {
      getDataFromUrl(ActionType.SignMsg)
      return Sea.getSignData()
    }
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
const _redPacketSign = (message, redPacket, password, address, pin) => {
  const host = process.env.UNIPASS_URL
  const successUrl = window.location.origin + '/create'
  const failUrl = window.location.origin + '/create'
  const pubkey = getPubkey()
  if (!pubkey) return
  const _url = `${host}?success_url=${successUrl}&fail_url=${failUrl}&pubkey=${pubkey}&message=${message}/#sign`
  saveState(
    ActionType.SignMsg,
    JSON.stringify({ message, redPacket, password, address, pin }),
  )
  console.log(_url)
  window.location.href = _url
  // const data = await new UnipassProvider(process.env.UNIPASS_URL).sign(message)
  // const sign = getDataFromSignString(data)
  // const { masterkey, authorization, localKey, sig } = sign
  // const { authSig, authInfo } = getSecondaryAuth(localKey, message, sig)
  // return {
  //   masterkey,
  //   authorization,
  //   localKey,
  //   authSig,
  //   authInfo,
  // }
}
Sea.getSignData = () => {
  const pageState = restoreState()
  const extraObj = pageState.extraObj
  console.log('[[[[pageState]]]]', pageState)
  if (extraObj) {
    const { message, redPacket, password, address, pin } = JSON.parse(extraObj)
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
    }
    return data
  }
  return null
}

Sea.bindSign = async ({ nfts, password, address, redPackeNumber }) => {
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
