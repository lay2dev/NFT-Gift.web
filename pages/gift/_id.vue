<template>
  <div id="page-share">
    <div class="email">{{ provider && provider._email }}</div>
    <img class="top-bg" src="~/assets/img/top-bg.png" />
    <template v-if="status === 'sucess'">
      <div class="sucess">
        <div class="t1">恭喜你</div>
        <div class="t2">成功领取到一个NFT</div>
      </div>
      <router-link to="/mine">
        <div class="balance">
          <img :src="require('~/assets/img/ze-balance-pay.svg')" />
          <div>打开钱包</div>
        </div>
      </router-link>
    </template>
    <template v-else-if="status === 'fail'">
      <div class="fail">
        <div class="t1">抱歉</div>
        <div class="t2">NFT红包已经被抢完了</div>
      </div>
      <div class="balance">
        <img :src="require('~/assets/img/ze-balance-pay.svg')" />
        <div>打开钱包</div>
      </div>
    </template>
    <template v-else>
      <div class="get">
        <div class="t1">您有一个待领取的</div>
        <div class="t2">NFT 红包</div>
        <div class="password">
          <el-input v-model="password" placeholder="输口令，领NFT"></el-input>
        </div>
        <div class="receive-box" @click="bindGet">
          <div class="receive">立 即 领 取</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import UnipassProvider from '@/assets/js/UnipassProvider.ts'
import PWCore, { ChainID, IndexerCollector } from '@lay2/pw-core'
import {
  getKeyPassword,
  decryptMasterKey,
  getAddressByPubkey,
} from '@/assets/js/ntf/utils'
import { redPacketTransfer } from '@/assets/js/ntf/transfer'

export default {
  validate({ params }) {
    return Boolean(params.id)
  },
  data() {
    return {
      status: '',
      password: '',
      provider: null,
    }
  },
  mounted() {
    const provider = Sea.localStorage('provider')
    if (provider) {
      this.provider = provider
    }
  },
  methods: {
    bindGet() {
      if (!this.provider) {
        this.bindLogin()
        return
      }
      const id = this.$route.params.id
      const password = this.password || 'default'
      this.getRedPacketData({
        id,
        address: this.provider._address.addressString,
        password: getKeyPassword(password),
      })
    },
    async getRedPacketData({ id, address, password }) {
      let res
      res = await Sea.Ajax({
        url: `/ntf/${id}`,
        method: 'get',
        data: {
          password,
          address,
        },
      })
      if (res.success) {
        const resData = res.data
        const fromAddress = getAddressByPubkey(resData.masterKeyPubkey)
        const toAddress = this.provider._address.addressString
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
        const key = await decryptMasterKey(
          data.encrypt,
          'generateKey',
          this.password,
        )
        const tx = await redPacketTransfer(
          data.masterKeyPubkey,
          data.authorization,
          data.localKeySig,
          key,
          data.keyPubkey,
          data.localAuthInfo,
          address,
          data.outpoints,
        )
        if (tx) {
          const host = process.env.NUXT_ENV_JINSE
          res = await Sea.Ajax({
            url: `${host}/api/explorer/v1/red_envelope_transactions`,
            method: 'post',
            data: {
              tx_hash: tx,
              from_address: fromAddress,
              to_address: toAddress,
            },
          })
          if (res === 'ok') {
            this.status = 'success'
            return
          }
        }
        // this.status = 'fail'
        this.$message.error('未知错误')
      } else {
        this.$message.error('红包口令错误')
      }
    },
    async bindLogin() {
      const url = {
        NODE_URL: 'https://testnet.ckb.dev',
        INDEXER_URL: 'https://testnet.ckb.dev/indexer',
        CHAIN_ID: ChainID.ckb_testnet,
      }
      await new PWCore(url.NODE_URL).init(
        new UnipassProvider(process.env.NUXT_ENV_UNIPASS_URL),
        new IndexerCollector(url.INDEXER_URL),
        url.CHAIN_ID,
      )
      const provider = PWCore.provider
      if (provider && provider._address) {
        Sea.localStorage('provider', provider)
        this.$message.info('登录成功')
        this.provider = provider
      } else {
        this.$message.warning('登录不成功')
      }
    },
  },
}
</script>
<style lang="stylus">
#page-share {
  position: relative;

  .email {
    position: absolute;
    top: 16px;
    text-align: center;
    color: #f88d6e;
  }

  .top-bg {
    width: 100%;
  }

  background: #F35543;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .sucess, .fail {
    color: #ffe2b0;
    letter-spacing: 6px;
    padding-left: 6px;
    font-size: 20px;
    text-align: center;

    .t1 {
      margin-top: 107px;
    }

    .t2 {
      margin-top: 28px;
      margin-bottom: 106px;
    }
  }

  .balance {
    img {
      width: 83px;
      height: 83px;
    }

    text-align: center;
    color: #000;
  }

  .get {
    .t1, .t2 {
      color: #fff;
      font-size: 28px;
      font-weight: bold;
      text-align: center;
    }

    .t1 {
      margin-top: 49px;
    }

    .t2 {
      margin-top: 16px;
    }

    .password {
      margin: 49px 56px 96px;

      .el-input__inner {
        text-align: center;
      }
    }

    .receive-box {
      display: flex;
      justify-content: center;

      .receive {
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 154px;
        height: 59px;
        border: 2px solid #FFE2B0;
        border-radius: 2px;
        color: #FFE2B0;
        font-size: 18px;
      }

      .receive:active {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
