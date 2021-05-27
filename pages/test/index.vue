<template>
  <div id="page-test">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="创建红包 - 授权签名" name="1">
        <div class="tip" @click="createKeyX">红包-创建红包：本地生成keyX</div>
        <div class="tip" @click="autheyX">
          红包-创建红包：并使用localKey对红包内容进行授权签名
        </div>
      </el-collapse-item>
      <el-collapse-item title="接收红包 - 组装交易" name="2">
        <div class="tip" @click="getRedPacketData">
          红包-接收红包：获取红包状态
        </div>
        <div class="tip">
          红包-接收红包：通过收到的红包链接，组装交易，使用keyX进行签名，并将完整提交交易上链
        </div>
      </el-collapse-item>
      <el-collapse-item title="分享图片" name="3">
        <div class="tip" @click="getShortData">
          红包-生成内含二维码的红包分享图片
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts">
// test
import {
  getAddressByPubkey,
  getDataFromSignString,
  getKeyPassword,
  getPubkeyHash,
  INDEXER_URL,
  generateKey,
} from './ntf/utils'
import { getSecondaryAuth, LocalAuthInfo } from './ntf/auth-item'
import { Address, AddressType, Amount, OutPoint } from '@lay2/pw-core'
import { UnipassIndexerCollector } from './ntf/unipass-indexer-collector'
console.log('ts', getAddressByPubkey('55'))
export default {
  data() {
    return {
      activeName: '',
      short: '',
    }
  },
  methods: {
    createKeyX() {
      getAddressByPubkey('Sdfadsfas')
    },
    autheyX() {},
    async getShortData(pwd: string, nfts: []) {
      console.log('[api]')
      const sign = 'data from unipass back sign message'
      const { masterkey, authorization, localKey } = getDataFromSignString(sign)
      // todo get N key
      const redPacket = []
      const keyAuthArray = []

      for (let item of nfts) {
        const { key, pubkey, pem } = await generateKey('salt', pwd)
        redPacket.push({
          encrypt: pem,
          keyPubkey: pubkey,
          outpoints: item, // todo item.outpoints
          outpointSize: item, // todo item.outpointSize
        })
        keyAuthArray.push({
          pubkey,
          outpoints: item, // todo item.outpoints
        })
      }
      const collector = new UnipassIndexerCollector(INDEXER_URL)
      const fromAddress = getAddressByPubkey(masterkey)
      console.log('fromAddress', fromAddress)
      const cells = await collector.collectAllLiveCells(
        new Address(fromAddress, AddressType.ckb),
        new Amount('10000'),
      )
      let inputCells = cells.slice(0, 4)
      const localAuth: LocalAuthInfo = []
      for (let item of keyAuthArray) {
        const data = {
          pubkeyHash: getPubkeyHash(item),
          // todo get by api
          outpoints: inputCells.map((x) => x.outPoint as OutPoint),
        }
        localAuth.push(data)
      }
      const { authSig, authInfo } = getSecondaryAuth(localKey, localAuth)
      const password = getKeyPassword(pwd)
      const data = {
        password,
        authorization: authorization, //
        localKeySig: authSig,
        localKeyPubkey: localKey,
        masterKeyPubkey: masterkey,
        localAuthInfo: authInfo,
        redPacket: [
          {
            encrypt: 'todoencrypt',
            keyPubkey: 'keyPubkey',
            outpoints: 'outpoints',
            outpointSize: 'outpointSize',
          },
        ],
      }
      console.log(data)
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
      console.log(this.short)
      const data = {
        password: 'todoencrypt',
        address: 'authorization',
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
        // todo get transfer data
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
