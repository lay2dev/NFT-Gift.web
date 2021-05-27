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
        <div @click="bindSign">点击签名:{{ sign }}</div>
      </el-collapse-item>
      <el-collapse-item title="4 提交服务器" name="4">
        <div @click="getShortData">short:{{ short }}</div>
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
import PWCore, { IndexerCollector } from '@lay2/pw-core'
import {
  getAddressByPubkey,
  getDataFromSignString,
  getKeyPassword,
  getPubkeyHash,
  generateKey,
  decryptMasterKey,
} from './ntf/utils'
import { getSecondaryAuth, serializeLocalAuth } from './ntf/auth-item'
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
      masterkey: '',
      authorization: '',
      localKey: '',
      redPacket: [],
      authSig: '',
      authInfo: '',
      message: '',
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
      console.log('[address]', this.address)
      const host = 'https://goldenlegend.test.nervina.cn'
      const res = await Sea.Ajax({
        url: `${host}/api/explorer/v1/holder_tokens/ckt1qsfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47dpu576827rnszukq8k4pkjga7nkjmes05senttc`,
        data: {
          page: 1,
          limit: 1000,
          include_submitting: true,
        },
      })
      if (res.token_list) {
        console.log('list', res.token_list)
        if (res.token_list.length) {
          this.nft = res.token_list[0]
          await this.createRedPacketData()
        }
      }
    },
    async createRedPacketData() {
      const nfts = [this.nft]
      const redPacket = []
      const keyAuthArray = []
      for (const item of nfts) {
        const { pubkey, pem } = await generateKey('generateKey', this.password)
        redPacket.push({
          encrypt: pem,
          keyPubkey: pubkey,
          outpoint: item.token_outpoint, // todo item.outpoints
          outpointSize: 1, // todo item.outpointSize
        })
        keyAuthArray.push({
          pubkey,
          outpoints: 1 + item.token_outpoint, // todo item.outpoints
        })
      }
      this.redPacket = redPacket
      console.log(this.redPacket)
      const localAuth = []
      for (const item of keyAuthArray) {
        const data = {
          pubkeyHash: getPubkeyHash(item.pubkey),
          outpoints: item.token_outpoint, // todo
        }
        localAuth.push(data)
      }
      console.log('[localAuth]', localAuth)
      // todo  get signdata
      const authItemsBuffer = serializeLocalAuth(localAuth)
      const authItemsHex = `0x${authItemsBuffer.toString('hex')}`
      console.log('[authItemsHex]', authItemsHex)
      this.message = authItemsHex
    },
    async bindSign() {
      const data = await new UnipassProvider(
        process.env.NUXT_ENV_UNIPASS_URL,
      ).sign(message)
      this.sign = data
      const { masterkey, authorization, localKey } = getDataFromSignString(
        this.sign,
      )
      this.masterkey = masterkey
      this.authorization = authorization
      this.localKey = localKey
      console.log('🌊signature', sign)
      const { authSig, authInfo } = getSecondaryAuth(
        localKey,
        this.message,
        this.sign,
      )
      this.authSig = authSig
      this.authInfo = authInfo
    },
    async getShortData() {
      const password = getKeyPassword(this.address)
      // todo push data
      const data = {
        password,
        authorization: this.authorization, //
        masterKeyPubkey: this.masterkey,
        localKeyPubkey: this.localKey,
        localKeySig: this.authSig,
        localAuthInfo: this.authInfo,
        redPacket: this.redPacket,
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

    async getRedPacketData() {
      console.log(this.short) // this is short url
      const address = getAddressByPubkey(this.masterkey)
      const password = getKeyPassword(this.password)
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
        this.tx = tx
        console.log('txhash:', tx)
        // todo tx post other api
      } else {
        // todo show no red packet
      }
      console.log(res)
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
