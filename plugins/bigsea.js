import '@/assets/js/bigsea'
import dayjs from 'dayjs'
import UnipassProvider from '@/assets/js/UnipassProvider.ts'
import PWCore, { ChainID, IndexerCollector } from '@lay2/pw-core'

// global variable utils Sea
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
  let provider
  provider = await Sea.checkLogin()
  if (provider) {
    return provider
  }
  const url = {
    NODE_URL: process.env.CKB_NODE_URL,
    INDEXER_URL: process.env.CKB_INDEXER_URL,
    CHAIN_ID:
      process.env.CKB_CHAIN_ID === '0' ? ChainID.ckb : ChainID.ckb_testnet,
  }
  await new PWCore(url.NODE_URL).init(
    new UnipassProvider(process.env.UNIPASS_URL),
    new IndexerCollector(url.INDEXER_URL),
    url.CHAIN_ID,
  )
  provider = PWCore.provider
  if (provider && provider._address) {
    provider._time = Date.now()
    Sea.localStorage('provider', provider)
    return provider
  }
  return null
}
