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
    const query = this.$route.query
    const info = Sea.SaveDataByUrl()
    if (info) {
      this.$message.warning(info)
    } else if (query.unipass_ret) {
      // 登陆后自动领取
      this.bindGet()
    }
    // check
    this.check()
  },
  methods: {
    check() {
      if (!this.$route.query.k) {
        this.$message.error('此链接无效')
        return false
      }
      return true
    },
    getTicket() {},
    async bindGet() {
      if (this.state === 'success') {
        this.bindSuccess()
        return
      } else if (this.state === 'fail') {
        this.bindFail()
        return
      }
      const loading = this.$loading()
      await this.login()
      if (!this.provider) {
        loading.close()
        return
      }
      if (!this.check()) {
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
          this.bindSuccess()
          this.state = 'success'
        } else {
          this.$message.error('交易无效')
        }
      }
      loading.close()
    },
    bindSuccess() {
      console.log('state', 'success')
    },
    bindFail() {
      console.log('state', 'fail')
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
          this.$message.error('NFT 已经被领完')
        } else if (res.status === -2) {
          this.$message.error('地址有误')
        } else if (res.status === -3) {
          this.bindFail()
          this.state = 'fail' // 你已经领过这个红包了
        } else if (res.status === -4) {
          this.$message.error('此链接无效')
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
