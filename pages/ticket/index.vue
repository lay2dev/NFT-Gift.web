<template>
  <div id="page-ticket">
    <el-image
      class="background"
      fit="cover"
      :src="require('~/assets/img/ticket/background.png')"
    />
    <el-image
      v-show="state === ''"
      class="get"
      :src="require('~/assets/img/ticket/get-wait.png')"
    />
    <el-image
      v-show="state === 'success'"
      class="get"
      :src="require('~/assets/img/ticket/get-success.png')"
    />
    <el-image
      v-show="state === 'fail'"
      class="get"
      :src="require('~/assets/img/ticket/get-already.png')"
    />
    <div class="bottom">
      <div class="btn-box" @click="bindGet">
        <el-image class="btn" :src="require('~/assets/img/ticket/btn.svg')" />
        <div class="txt">{{ btnText }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { decryptMasterKey } from '~/assets/js/nft/utils'
import { redPacketTransfer } from '~/assets/js/nft/transfer'

export default {
  data() {
    return {
      state: '',
      provider: null,
    }
  },
  computed: {
    btnText() {
      if (this.state === 'success') {
        return '查看领取的数字纪念品'
      } else if (this.state === 'fail') {
        return '探索更多的数字纪念品'
      } else {
        return '登录并领取数字纪念品'
      }
    },
  },
  created() {
    // login
    const info = Sea.SaveDataByUrl()
    if (info) this.$message.warning(info)
    // check
    this.check()
  },
  methods: {
    check() {
      const query = this.$route.query
      for (const key of ['k']) {
        if (!query[key]) {
          this.$message.error('链接无效')
          return false
        }
      }
      return true
    },
    async bindGet() {
      if (this.state === 'success') {
        Sea.open(process.env.UNIPASS_URL)
        return
      } else if (this.state === 'fail') {
        Sea.open(process.env.UNIPASS_URL)
        return
      }
      const loading = this.$loading()
      await this.login()
      if (!this.provider) {
        loading.close()
        return
      }
      if (this.check() === false) {
        loading.close()
        return
      }
      const { k: key } = this.$route.query
      const address = this.provider._address.addressString
      const res = await this.getStatus({ address, key })
      if (res.success) {
        const resData = res.data
        const toAddress = address
        const data = {
          authorization: resData.authorization,
          localKeySig: resData.localKeySig,
          localKeyPubkey: resData.localKeyPubkey,
          masterKeyPubkey: resData.masterKeyPubkey,
          localAuthInfo: resData.localAuthInfo,
          encrypt: resData.encrypt,
          keyPubkey: resData.keyPubkey,
          outpointSize: resData.outpointSize,
          salt: resData.salt,
          password: resData.password,
          outpoints: [JSON.parse(resData.outpoints)],
        }
        try {
          const key = await decryptMasterKey(
            data.encrypt,
            data.salt,
            data.password,
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
            true,
          )
          await Sea.Ajax({
            url: `/ticket/tx`,
            method: 'post',
            data: {
              tx: tx || '0x',
              toAddress,
              id: resData.id,
            },
          })
          if (tx) {
            this.state = 'success'
          } else {
            this.$message.error('交易无效')
          }
        } catch (err) {
          console.log('error', err)
          this.$message.error('链接错误')
        }
      }
      loading.close()
    },
    async getStatus({ address, key }) {
      const res = await Sea.Ajax({
        url: `/ticket/nft`,
        method: 'get',
        data: {
          key,
          address,
        },
      })
      if (!res.success) {
        if (res.status === -1) {
          this.$message.error('NFT 门票已经被抢完了')
        } else if (res.status === -2) {
          this.$message.error('地址有误')
        } else if (res.status === -3) {
          this.state = 'fail' // 你已经领过这个红包了
        } else if (res.status === -4) {
          this.$message.error('链接错误')
        }
      }
      return res
    },
    async login() {
      const provider = await Sea.bindLogin()
      if (provider) {
        this.provider = provider
      }
    },
  },
}
</script>
<style lang="stylus">
#page-ticket {
  margin: 0 auto;
  max-width: 500px;
  position: relative;
  background: #EEE;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .get {
    margin-top: 16vh;
    width: 299px;
    height: 340px;
  }

  .bottom {
    position: absolute;
    bottom: 15vh;

    .btn-box {
      cursor: pointer;
      position: relative;
      // margin-top: 15vh;
      // margin-bottom: 10vh;
      font-weight: bold;
      user-select: none;

      .txt {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 8px;
      }
    }
  }
}

@media (min-width: 500px) {
  #page-ticket {
    min-height: 667px;
  }
}
</style>
