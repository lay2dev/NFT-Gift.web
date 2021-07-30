<template>
  <div id="page-gift" :class="lang">
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

    <div class="receive-box" @click="bindGet">
      <el-button class="receive" :loading="loading">{{ t_('btn') }}</el-button>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { decryptMasterKey } from '~/assets/js/nft/utils'
import { redPacketTransfer } from '~/assets/js/nft/transfer'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

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

  created() {
    const info = Sea.SaveDataByUrl()
    if (info) this.$message.warning(info)
  },
  mounted() {
    this.init()
  },
  methods: {
    date(date) {
      const t_ = this.t_
      const startDate = dayjs()
      const endDate = dayjs(date)
      const isSameDay = startDate.isSame(endDate, 'day')
      const isSameMonth = startDate.isSame(endDate, 'month')
      const isSameYear = startDate.isSame(endDate, 'year')
      let end = endDate.format(t_('recoder.date'))
      if (isSameDay) {
        end = endDate.format(t_('recoder.sameDay'))
      } else if (isSameMonth) {
        end = endDate.format(t_('recoder.sameMonth'))
      } else if (isSameYear) {
        end = endDate.format(t_('recoder.sameYear'))
      }
      return end
    },
    address(address) {
      if (address.includes('@')) return address
      const start = address.slice(0, 3)
      const end = address.slice(-3)
      return `${start}...${end}`
    },
    t_(key) {
      return this.$t(`gift.${key}`)
    },

    init() {
      if (!this.provider) {
        this.bindLogin(true)
      }
    },

    bindGet() {
      this.loading = true
      if (!this.provider) {
        this.bindLogin()
        return
      }
      this.getRedPacketData({
        address: this.provider._address.addressString,
      })
    },

    async getStatus({ address }) {
      const id = this.$route.params.id || 'null'
      const res = await Sea.Ajax({
        url: `/ticket/nft`,
        method: 'get',
        data: {
          key: id,
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
      let res = await this.getStatus({ address, password })
      if (res.success) {
        const resData = res.data
        const toAddress = this.provider._address.addressString
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
        res = await Sea.Ajax({
          url: `/ticket/tx`,
          method: 'post',
          data: {
            tx: tx || '0x',
            toAddress,
            id: resData.id,
          },
        })
        if (tx) {
          this.status = 'success'
        } else {
          this.status = 'fail'
          // 交易无效
          this.$message.error(this.t_('tip1'))
        }
      } else if (res.status === 0) {
        // 红包口令错误
        this.$message.error(this.t_('tip2'))
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
        this.$message.warning(this.t_('tip3'))
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
  min-height: 100vh;
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
    padding: 0 20px;
    font-size: 20px;
    text-align: center;

    .t1 {
      margin-top: 40px;
    }

    .t2 {
      margin-top: 28px;
      margin-bottom: 40px;
    }
  }

  .recoder {
    border-top: 1px dashed #000;
    width: 100%;
    text-align: center;
    padding: 20px;

    .sender {
      font-weight: bold;
      margin-bottom: 20px;
    }

    .packets {
      margin-top: 20px;
      border-bottom: 1px dashed #000;

      .packet {
        border-top: 1px dashed #000;
        padding: 4px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          text-align: left;
          flex-shrink: 0;

          .date {
            color: #000;
            font-size: 14px;
          }
        }

        .right {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          margin-bottom: -4px;

          .nft {
            cursor: pointer;
            display: flex;
            align-items: center;
            margin-bottom: 4px;

            img.renderer {
              background: #ffe2b0;
              border-radius: 4px;
              margin-left: 8px;
              object-fit: cover;
              overflow: hidden;
              width: 30px;
              height: 30px;
            }
          }
        }
      }
    }
  }

  .btns {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    margin-bottom: 40px;

    .balance {
      cursor: pointer;

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
        min-width: 154px;
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

#page-gift.zh {
  .success, .fail {
    letter-spacing: 6px;
  }
}
</style>
