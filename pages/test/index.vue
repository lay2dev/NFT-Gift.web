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
        <div>带签名数据 message:{{ message }}</div>
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
        <div @click="getRedPacketData">data:{{ data }}</div>
      </el-collapse-item>
      <el-collapse-item title="7 提交交易" name="7">
        <div>tx:{{ tx }}</div>
      </el-collapse-item>
      <el-collapse-item title="8 返回交易" name="8">
        <div @click="testPassword">res:{{ res }}</div>
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
        console.log('list', res.token_list[0])
        if (res.token_list.length) {
          this.nft = res.token_list[0]
          await this.createRedPacketData()
        }
      }
    },
    async createRedPacketData() {
      const nfts = [this.nft]
      const redPacket = []
      const localAuth = []
      for (const item of nfts) {
        const { pubkey, pem } = await generateKey('generateKey', this.password)
        console.log('[token_outpoint]', item.token_outpoint)
        const outpoints = [
          {
            index: `0x${item.token_outpoint.index.toString(16)}`,
            txHash: item.token_outpoint.tx_hash,
          },
        ]
        redPacket.push({
          encrypt: pem,
          keyPubkey: pubkey,
          outpoints: JSON.stringify(outpoints),
          outpointSize: 1,
        })
        localAuth.push({
          pubkeyHash: getPubkeyHash(pubkey),
          outpoints: [
            {
              index: item.token_outpoint.index,
              txHash: item.token_outpoint.tx_hash,
            },
          ],
        })
      }
      this.redPacket = redPacket
      console.log(this.redPacket)
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
      ).sign(this.message)
      console.log('[sign]', data)
      this.sign = data
      console.log('[this.sign]', this.sign)
      const { masterkey, authorization, localKey } = getDataFromSignString(
        this.sign,
      )
      console.log('[masterkey, authorization, localKey]', {
        masterkey,
        authorization,
        localKey,
      })
      this.masterkey = masterkey
      this.authorization = authorization
      this.localKey = localKey
      const { authSig, authInfo } = getSecondaryAuth(
        localKey,
        this.message,
        this.sign,
      )
      this.authSig = authSig
      this.authInfo = authInfo
    },
    async getShortData() {
      const password = getKeyPassword(this.password)
      console.log('[password]', password, this.password)
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
      Sea.Ajax.HOST = process.env.NUXT_ENV_HOST
      console.log('[Host]', Sea.Ajax.HOST)
      const res = await Sea.Ajax({
        url: '/ntf',
        method: 'post',
        data,
      })
      console.log('res', res, this.short, window.location)
      if (res.short) this.short = res.short
      console.log('res', res, this.short)
      // todo router
      this.shortUrl = window.location.origin + '/share/' + this.short
    },

    testPassword() {
      const password = getKeyPassword(this.password)
      console.log(password)
    },
    async getRedPacketData() {
      console.log('[getRedPacketData]', this.short) // this is short url
      const address = getAddressByPubkey(this.masterkey)
      const password = getKeyPassword(this.password)
      console.log('[password]', password, this.password)
      // todo get data
      const data = {
        password,
        address,
      }
      console.log('[data]', data)
      Sea.Ajax.HOST = process.env.NUXT_ENV_HOST
      console.log('[host]', Sea.Ajax.HOST)
      const res = await Sea.Ajax({
        url: `/ntf/${this.short}`,
        method: 'get',
        data: {
          password: data.password,
          address: data.address,
        },
      })
      if (res.success) {
        const resData = res.data
        console.log('[resData]', resData)
        const data = {
          authorization: resData.authorization, //
          localKeySig: resData.localKeySig,
          localKeyPubkey: resData.localKeyPubkey,
          masterKeyPubkey: resData.masterKeyPubkey,
          localAuthInfo: resData.localAuthInfo,
          encrypt: resData.encrypt,
          keyPubkey: resData.keyPubkey,
          outpointSize: resData.outpointSize,
          outpoints: JSON.parse(resData.outpoints),
        }
        console.log('[data]', resData, resData.encrypt)
        // todo
        const key = await decryptMasterKey(
          data.encrypt,
          'generateKey',
          this.password,
        )
        console.log('[key]', key)
        // todo transfer
        const tx = await redPacketTransfer(
          data.masterKeyPubkey,
          data.authorization,
          data.localKeySig,
          key,
          data.pubkey,
          data.localAuthInfo,
          address,
          data.outpoints,
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
