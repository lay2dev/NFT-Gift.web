<template>
  <div id="page-gift">
    <div class="email">{{ provider && provider._email }}</div>
    <img class="top-bg" src="~/assets/img/top-bg.png" />
    <template v-if="status === 'success'">
      <div class="success">
        <div class="t1">{{ t_('success.t1') }}</div>
        <div class="t2">{{ t_('success.t2') }}</div>
      </div>
    </template>
    <template v-else-if="status === 'fail'">
      <div class="fail">
        <template v-if="statusCode === -3">
          <div class="t1">{{ t_('fail.code3.t1') }}</div>
          <div class="t2">{{ t_('fail.code3.t2') }}</div>
        </template>
        <template v-else-if="statusCode === -2">
          <div class="t1">{{ t_('fail.code2.t1') }}</div>
          <div class="t2">{{ t_('fail.code2.t2') }}</div>
        </template>
        <template v-else>
          <div class="t1">{{ t_('fail.code1.t1') }}</div>
          <div class="t2">{{ t_('fail.code1.t2') }}</div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="get">
        <template v-if="question">
          <div class="t1">{{ t_('question.t1') }}</div>
          <div class="tip">{{ t_('question.tip') }}</div>
          <div class="t2">{{ question }}</div>
        </template>
        <template v-else>
          <div class="t1">{{ t_('password.t1') }}</div>
          <div class="t2">{{ t_('password.t2') }}</div>
        </template>
        <div class="password">
          <el-input
            v-model="password"
            :placeholder="
              question ? t_('question.placeholder') : t_('password.placeholder')
            "
            @keyup.enter="bindGet"
          ></el-input>
        </div>
        <div class="receive-box" @click="bindGet">
          <el-button class="receive" :loading="loading">{{
            t_('btn')
          }}</el-button>
        </div>
      </div>
    </template>
    <template v-if="status === 'success' || status === 'fail'">
      <div class="btns">
        <div class="balance" @click="bindWallet">
          <img :src="require('~/assets/img/gift-open-wallet.svg')" />
          <div>{{ t_('open') }}</div>
        </div>
        <div class="balance nft" @click="bindCreate">
          <img :src="require('~/assets/img/gift-create-redpacket.svg')" />
          <div>{{ t_('send') }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { getKeyPassword, decryptMasterKey } from '~/assets/js/nft/utils'
import { redPacketTransfer } from '~/assets/js/nft/transfer'

export default {
  data() {
    return {
      status: '',
      statusCode: null,
      password: '',
      provider: null,
      loading: false,
      question: this.$route.query.q || '',
    }
  },
  computed: {
    giftPassword() {
      return this.password || 'unipass'
    },
  },
  created() {
    const info = Sea.SaveDataByUrl()
    if (info) this.$message.warning(info)
  },
  mounted() {
    this.init()
  },
  methods: {
    t_(key) {
      return this.$t(`gift.${key}`)
    },
    bindWallet() {
      window.location.href = process.env.UNIPASS_URL + '/home'
    },
    bindCreate() {
      this.$router.push(Sea.lang + '/create')
    },
    init() {
      if (!this.provider) {
        this.bindLogin(true)
        return
      }
      this.$nextTick(() => {
        this.getStatus({
          address: 'do_not_need_address',
          password: getKeyPassword('do_not_need_password'),
        })
      })
    },
    bindGet() {
      this.loading = true
      if (!this.provider) {
        this.bindLogin()
        return
      }
      this.getRedPacketData({
        address: this.provider._address.addressString,
        password: getKeyPassword(this.giftPassword),
      })
    },
    async getStatus({ address, password }) {
      const id = this.$route.params.id || 'null'
      const res = await Sea.Ajax({
        url: `/nft/${id}`,
        method: 'get',
        data: {
          password,
          address,
        },
      })
      this.statusCode = res.status
      if (res.status < 0) {
        this.status = 'fail'
      }
      return res
    },
    async getRedPacketData({ address, password }) {
      const loading = this.$loading({
        lock: true,
      })
      let res
      res = await this.getStatus({ address, password })
      if (res.success) {
        const resData = res.data
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
          this.giftPassword,
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
        res = await Sea.Ajax({
          url: `/nft/tx`,
          method: 'post',
          data: {
            txHash: tx || '0x',
            toAddress,
            id: resData.id,
          },
        })
        console.log('tx', tx)
        if (tx) {
          this.status = 'success'
        } else {
          this.status = 'fail'
          // 交易无效
          this.$message.error(this.t('tip1'))
        }
      } else if (res.status === 0) {
        // 红包口令错误
        this.$message.error(this.t('tip2'))
      }
      this.loading = false
      loading.close()
    },
    async bindLogin(init) {
      this.loading = true
      const provider = await Sea.bindLogin()
      if (provider) {
        this.provider = provider
        if (init) {
          this.init()
        }
      } else {
        // 登录失败
        this.$message.warning(this.t('tip3'))
      }
      this.loading = false
    },
  },
}
</script>
<style lang="stylus">
#page-gift {
  margin: 0 auto;
  max-width: 475px;
  position: relative;
  background: #F35543;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .email {
    position: absolute;
    top: 16px;
    text-align: center;
    color: #f88d6e;
  }

  .top-bg {
    width: 100%;
  }

  .success, .fail {
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

  .btns {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;

    .balance {
      img {
        width: 55px;
        height: 55px;
      }

      text-align: center;
      color: #000;
    }

    .balance.nft {
      margin-left: 55px;
    }
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

    .tip {
      margin-top: 12px;
      color: #fff;
      text-align: center;
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
        background: transparent;
        font-size: 18px;
      }

      .receive:active {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
