<template>
  <div id="page-gift">
    <div v-if="unipassLoading" id="unipass-loading">
      <span class="loader"></span>
    </div>
    <img class="unipass-bg" src="~/assets/img/unipass-bg.svg" />
    <div class="top-bg">
      <img src="~/assets/img/top-bg.svg" />
      <div v-if="provider && provider._email" class="email">
        <span>{{ t_('account') }}</span>
        <span>{{ provider._email }}</span>
      </div>
    </div>
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
          <span>{{ t_('open') }}</span>
        </div>
        <div class="balance nft" @click="bindCreate">
          <img :src="require('~/assets/img/gift-create-redpacket.svg')" />
          <span>{{ t_('send') }}</span>
        </div>
      </div>
      <div v-if="recoder && statusCode !== -2" class="recoder">
        <div class="sender1">
          {{ t_('recoder.form') }} {{ address(recoder.senderAddress) }}
          {{ t_('recoder.who') }}
        </div>
        <span class="sender2">
          {{ t_('recoder.t1') }} {{ recoder.packets.length }}
          {{ t_('recoder.t2') }}
          {{ recoder.packetNum - recoder.packets.length }}
          {{ t_('recoder.t3') }} {{ recoder.nftNum }} {{ t_('recoder.t4') }}
        </span>
        <div class="packets">
          <div v-for="(e, i) in recoder.packets" :key="i" class="packet">
            <div class="left">
              <div class="address">{{ address(e.receiverAddress) }}</div>
              <div class="date">{{ date(e.receivedAt) }}</div>
            </div>
            <div class="right">
              <div
                v-for="(nft, i2) in e.nfts"
                :key="i2"
                class="nft"
                @click="bindNFT(nft)"
              >
                <img class="renderer" :src="nft.renderer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <mine-asset :show.sync="showAsset" :nft="nftItem" />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getKeyPassword, decryptMasterKey } from '~/assets/js/nft/utils'
import { redPacketTransfer } from '~/assets/js/nft/transfer'
import MineAsset from '~/components/mine-asset.vue'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)

export default {
  components: {
    MineAsset,
  },
  data() {
    return {
      unipassLoading: true,
      status: '',
      statusCode: null,
      password: '',
      provider: null,
      loading: false,
      question: this.$route.query.q || '',
      // 领取记录
      recoder: null,
      showAsset: false,
      nftItem: {},
    }
  },
  computed: {
    giftPassword() {
      // 大小写不敏感
      return this.password.toLowerCase() || 'unipass'
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
    bindNFT(nft) {
      this.nftItem = nft
      this.showAsset = true
    },
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
      address = address || ''
      if (address.includes('@')) return address
      const start = address.slice(0, 3)
      const end = address.slice(-3)
      return `${start}...${end}`
    },
    t_(key) {
      return this.$t(`gift.${key}`)
    },
    bindWallet() {
      window.location.href = process.env.UNIPASS_URL
    },
    bindCreate() {
      this.$router.push('/create/')
    },
    init() {
      if (!this.provider) {
        this.bindLogin(true)
        return
      }
      this.$nextTick(async () => {
        this.getRecoder()
        await this.getStatus({
          address: 'do_not_need_address',
          password: getKeyPassword('do_not_need_password'),
        })
        this.unipassLoading = false
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
    async getRecoder() {
      const id = this.$route.params.id || ''
      const res = await Sea.Ajax({
        url: `/nft/recoder`,
        method: 'get',
        data: {
          key: id,
        },
      })
      this.recoder = res
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
            tx: tx || '0x',
            toAddress,
            id: resData.id,
          },
        })
        if (tx) {
          this.status = 'success'
          this.getRecoder()
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
        // this.$message.warning(this.t_('tip3'))
      }
      this.loading = false
    },
  },
}
</script>
<style lang="stylus">
#page-gift {
  margin: 0 auto;
  max-width: 480px;
  position: relative;
  background: var(--primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  .unipass-bg {
    position: absolute;
    top: 143px;
    right: -31px;
  }

  .top-bg {
    z-index: 1;
    position: relative;
    width: 100%;

    img {
      width: 100%;
    }

    .email {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      width: 100%;
      text-align: center;
      font-weight: bold;
      color: #FFD874;
      line-height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      span {
        margin-bottom: 4px;
      }
    }
  }

  .success, .fail {
    z-index: 1;
    color: #fff;
    padding: 0 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    line-height: 36px;

    .t1 {
      margin-top: 58px;
    }
  }

  .recoder {
    z-index: 1;
    width: 100%;
    text-align: center;
    padding: 0 20px;
    color: #fff;

    .sender1 {
      font-size: 14px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.29);
    }

    .sender2 {
      font-size: 12px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.29);
    }

    .packets {
      margin-top: 40px;

      .packet {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;

        .left {
          text-align: left;
          flex-shrink: 0;
          width: 150px;

          .address {
            font-size: 14px;
            font-weight: bold;
          }

          .date {
            margin-top: 6px;
            font-size: 12px;
            font-weight: 400;
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
              border: 1px solid rgba(255, 255, 255, 0.29);
              border-radius: 12px;
              margin-left: 8px;
              object-fit: cover;
              overflow: hidden;
              width: 38px;
              height: 38px;
            }
          }
        }
      }
    }
  }

  .btns {
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    margin-top: 60px;
    margin-bottom: 60px;
    font-size: 14px;
    font-weight: 500;
    color: #FFF;
    line-height: 20px;

    .balance {
      font-size: 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 66px;
        height: 66px;
      }

      span {
        margin-top: 6px;
      }
    }

    .balance:hover {
      color: rgba(0, 0, 0, 0.89);
    }

    .balance.nft {
      margin-left: 98px;
    }
  }

  .get {
    z-index: 1;

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

body.zh {
  #page-gift {
    .success, .fail {
      letter-spacing: 2px;
      font-weight: 500;
    }
  }
}
</style>
