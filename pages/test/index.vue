<template>
  <div id="page-test">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="1登录" name="1">
        <div @click="bindLogin">
          <span>当前地址：{{ address }}</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title=" 2 NFT 设置密码" name="2">
        <div><el-input v-model="password"></el-input></div>
        <div @click="getNFT">点击获取 NFT:{{ nft }}</div>
      </el-collapse-item>
      <el-collapse-item title="3 签名授权" name="3">
        <div>sign:{{ sign }}</div>
      </el-collapse-item>
      <el-collapse-item title="4 提交服务器" name="4">
        <div>short:{{ short }}</div>
      </el-collapse-item>
      <el-collapse-item title="5 分享地址" name="5">
        <div>shortUrl:{{ shortUrl }}</div>
      </el-collapse-item>
      <el-collapse-item title="6 输入口令获取数据" name="6">
        <div><el-input v-model="password"></el-input></div>
        <div>data:{{ data }}</div>
      </el-collapse-item>
      <el-collapse-item title="7 提交交易" name="7">
        <div>tx:{{ tx }}</div>
      </el-collapse-item>
      <el-collapse-item title="8 返回交易" name="8">
        <div>res:{{ res }}</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
// test
import UnipassProvider from '@/assets/js/UnipassProvider.ts'
import PWCore, {
  // Address,
  // AddressType,
  // Amount,
  IndexerCollector,
} from '@lay2/pw-core'
import {
  getAddressByPubkey,
  getDataFromSignString,
  getKeyPassword,
  getPubkeyHash,
  generateKey,
  decryptMasterKey,
} from './ntf/utils'
import { getSecondaryAuth } from './ntf/auth-item'
import { redPacketTransfer } from './ntf/transfer'
export default {
  data() {
    return {
      activeName: '',
      short: '',
      shortUrl: '',
      address: '',
      password: '',
      nft: null,
      sign: '',
      tx: '',
      data: '',
      res: '',
    }
  },
  methods: {
    async bindLogin() {
      const url = {
        NODE_URL: 'https://testnet.ckb.dev',
        INDEXER_URL: 'https://testnet.ckb.dev/indexer',
        CHAIN_ID: 1,
      }
      await new PWCore(url.NODE_URL).init(
        new UnipassProvider(process.env.NUXT_ENV_UNIPASS_URL),
        new IndexerCollector(url.INDEXER_URL),
        url.CHAIN_ID,
      )
      if (PWCore.provider) {
        this.address = PWCore.provider.address.addressString
        console.log(this.address)
      } else {
        this.$message.error('连接失败')
      }
    },
    async getNFT() {
      const { Sea } = this
      const host = 'https://goldenlegend.test.nervina.cn'
      const res = await Sea.Ajax({
        url: `${host}/api/explorer/v1/holder_tokens/${this.address}`,
        data: {
          page: 1,
          limit: 1000,
          include_submitting: true,
        },
      })
      if (res.token_list) {
        console.log('list', res.token_list)
        this.nftList = res.token_list
      }
    },
    createKeyX() {
      getAddressByPubkey('Sdfadsfas')
    },
    autheyX() {},
    async getShortData(pwd, nfts) {
      console.log('[api]')
      // todo sign unipass
      const sign = 'data from unipass back sign message'
      const { masterkey, authorization, localKey } = getDataFromSignString(sign)
      // todo get N key
      const redPacket = []
      const keyAuthArray = []
      for (const item of nfts) {
        const { pubkey, pem } = await generateKey('generateKey', pwd)
        redPacket.push({
          encrypt: pem,
          keyPubkey: pubkey,
          outpoint: item.outpoint, // todo item.outpoints
          outpointSize: item.outpoint_size, // todo item.outpointSize
        })
        keyAuthArray.push({
          pubkey,
          outpoints: item, // todo item.outpoints
        })
      }
      const localAuth = []
      for (const item of keyAuthArray) {
        const data = {
          pubkeyHash: getPubkeyHash(item.pubkey),
          // get outpoints by api outpoints = outpoint_size + [outpoint]
          outpoints: item.outpoint_size + item.outpoint,
        }
        localAuth.push(data)
      }
      const { authSig, authInfo } = getSecondaryAuth(localKey, localAuth)
      const password = getKeyPassword(pwd)
      // todo push data
      const data = {
        password,
        authorization, //
        localKeySig: authSig,
        localKeyPubkey: localKey,
        masterKeyPubkey: masterkey,
        localAuthInfo: authInfo,
        redPacket,
      }
      console.log(data)
      // todo js ts use one file bug
      console.log('[Host]', Sea.Ajax.HOST)
      const res = await Sea.Ajax({
        url: '/ntf',
        method: 'post',
        data,
      })
      console.log('res', res, this.short)
      if (res.short) this.short = res.short
      console.log('res', res, this.short)
    },

    async getRedPacketData(pubkey, pwd) {
      console.log(this.short) // this is short url
      const address = getAddressByPubkey(pubkey)
      const password = getKeyPassword(pwd)
      // todo get data
      const data = {
        password,
        address,
      }
      const res = await Sea.Ajax({
        url: `/ntf/${this.short}`,
        method: 'get',
        data: {
          password: data.password,
          address: data.address,
        },
      })
      if (data.success) {
        const resData = res.data
        const data = {
          authorization: resData.authorization, //
          localKeySig: resData.authSig,
          localKeyPubkey: resData.localKey,
          masterKeyPubkey: resData.masterkey,
          localAuthInfo: resData.authInfo,
          redPacket: resData.redPacket,
        }
        // todo
        const key = await decryptMasterKey(
          data.redPacket.encrypt,
          'generateKey',
          pwd,
        )
        // todo transfer
        const tx = await redPacketTransfer(
          data.masterKeyPubkey,
          data.authorization,
          data.localKeySig,
          key,
          data.redPacket.pubkey,
          data.localAuthInfo,
          address,
        )
        console.log('txhash:', tx)
        // todo tx post other api
      } else {
        // todo show no red packet
      }
      console.log(res)
    },

    async bindSign(message) {
      console.log('🌊message', message)
      const messageHash = createHash('SHA256')
        .update(message)
        .digest('hex')
        .toString()
      const data = await new UnipassProvider(
        process.env.NUXT_ENV_UNIPASS_URL,
      ).sign(messageHash)
      let signature = ''
      let pubkey = ''
      if (data.startsWith('0x')) {
        signature = data
      } else {
        const info = JSON.parse(data)
        pubkey = info.pubkey
        signature = `0x01${info.sign.replace('0x', '')}`
      }
      console.log('🌊pubkey', pubkey)
      console.log('🌊signature', signature)
    },
  },
}
</script>
<style lang="stylus">
#page-test {
  padding: 20px;

  .tip {
    color: #999;
  }
}
</style>
