<template>
  <div id="page-share">
    <el-image class="top-bg" :src="require('~/assets/img/top-bg.png')" />
    <template v-if="status === 'sucess'">
      <div class="sucess">
        <div class="t1">恭喜你</div>
        <div class="t2">领取成功</div>
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
        <div class="t2">领取失败</div>
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
export default {
  validate({ params }) {
    return Boolean(params.id)
  },
  data() {
    return {
      status: '',
      password: '',
    }
  },
  methods: {
    bindGet() {
      // this.status = 'sucess'
      const id = this.$route.params.id
      const password = this.password || 'default'
      console.log('🌊', id, password)
    },
    async getRedPacketData() {
      const address = getAddressByPubkey(this.masterkey)
      const password = getKeyPassword(this.password)
      // todo get data
      const data = {
        password,
        address,
      }
      Sea.Ajax.HOST = process.env.NUXT_ENV_HOST
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
        // todo
        const key = await decryptMasterKey(
          data.encrypt,
          'generateKey',
          this.password,
        )

        // todo transfer
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
        this.tx = tx
        // todo tx post other api
      } else {
        // todo show no red packet
      }
    },
  },
}
</script>
<style lang="stylus">
#page-share {
  .top-bg {
    min-height: 130px;
    width: 100vw;
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
