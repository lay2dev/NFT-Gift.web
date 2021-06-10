<template>
  <div id="page-record">
    <back />
    <div class="page-title">红包记录</div>
    <el-collapse v-model="activeList" class="records">
      <el-collapse-item
        v-for="(e, i) in records"
        :key="i"
        :name="i"
        class="record"
        :class="e.direction"
      >
        <div slot="title" class="record-title">
          <template v-if="e.direction === 'in'">
            <img src="~/assets/img/record-in.svg" alt="in" />
            <div class="text">收到</div>
            <div class="red">{{ e.nftNum }} NFT</div>
          </template>
          <template v-else>
            <img src="~/assets/img/record-out.svg" alt="out" />
            <div class="text">发出</div>
            <div class="red">{{ e.packetNum }} 红包 {{ e.nftNum }} NFT</div>
          </template>
          <div class="date">
            {{ dayjs(e.createdAt).format('M月D日 HH:mm') }}
          </div>
          <div class="state">{{ StatusDictBig[e.status] }}</div>
        </div>
        <div class="record-box">
          <div class="left">
            <div class="line">
              <span>
                红包状态：<span class="black">{{
                  StatusDictBig[e.status]
                }}</span>
              </span>
            </div>
            <div class="line">
              <span>
                未被领取：<span class="red"
                  >{{ e.packetNum - e.picked }} 个红包
                </span>
              </span>
            </div>
            <div class="line">
              <span>
                已被领取：<span>{{ e.picked }} 个红包</span>
              </span>
            </div>
            <div class="line">
              发起时间：<span>{{
                dayjs(e.createdAt).format('YYYY年M月D日 HH:mm')
              }}</span>
            </div>
          </div>
          <div class="right">
            <div class="btn">
              <el-button
                size="mini"
                icon="el-icon-share"
                @click="bindShare(nft)"
              >
                分享
              </el-button>
            </div>
            <div class="btn">
              <el-button
                size="mini"
                icon="el-icon-refresh-left"
                @click="bindCancel(nft)"
              >
                撤回
              </el-button>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  components: {},
  data() {
    return {
      loading: false,
      address: '',
      records: [],
      activeList: [0, 1, 2],
      StatusDictBig: {
        create: '创建红包',
        init: '领取中',
        pending: '进行中',
        committed: '领取完成',
        cancel: '已撤销',
        fail: '领取失败',
      },
      statusDictSmall: {
        create: '创建红包',
        init: '领取中',
        pending: '确认中',
        committed: '领取完成',
        cancel: '已撤销',
        fail: '领取失败',
      },
    }
  },
  async mounted() {
    const provider = await Sea.bindLogin()
    if (provider) {
      this.address = provider._address.addressString
      this.init()
    } else {
      this.$router.replace('/')
    }
  },
  methods: {
    dayjs,
    async init() {
      this.loading = true
      const res = await Sea.Ajax({
        url: '/nft/history',
        method: 'post',
        data: {
          address: this.address,
          limit: 1000,
          page: 0,
        },
      })
      console.log('🌊', JSON.parse(JSON.stringify(res[0])))
      this.records = res
      this.loading = false
    },
    bindShare(nft) {
      this.$router.push(`/share/${nft.shortkey}`)
    },
    async bindCancel(nft) {
      this.loading = true
      const res = await Sea.Ajax({
        url: '/nft/cancel',
        method: 'post',
        data: {
          id: nft.id,
          fromAddress: this.address,
        },
      })
      if (res.success) {
        await this.init()
        this.$message.success('撤销成功')
      } else {
        this.$message.success('撤销失败')
      }
    },
  },
  sockets: {
    connect() {
      console.log('sockets', 'connect')
      this.$socket.emit('login', { type: 'address', value: this.address })
    },
    newTx(data) {
      console.log('sockets-newTx-')
      // todo 刷新
      console.log(data)
    },
    disconnect() {
      console.log('sockets-disconnect：', '已经断开 socket 链接')
    },
    reconnect() {
      this.$socket.emit('connect')
    },
  },
}
</script>

<style lang="stylus">
#page-record {
  .page-title {
    margin-top: 8px;
    font-size: 16px;
    text-align: center;
    color: rgba(16, 16, 16, 100);
    height: 35px;
    line-height: 35px;
  }

  .records {
    margin-top: 31px;
    margin-bottom: 31px;
    border: 0;

    .el-collapse-item__header {
      background: transparent;
      height: 40px;
      line-height: 40px;
      border: 0;
      padding-left: 14px;
    }

    .el-collapse-item__wrap {
      border: 0;
      background: transparent;
    }

    .el-collapse-item__content {
      padding: 0;
    }

    .el-collapse-item__arrow {
      color: #000;
      font-weight: bold;
      font-size: 18px;
    }

    .record {
      margin: 0 10px 10px;
      border-radius: 5px;
      color: rgba(16, 16, 16, 1);
      font-size: 16px;
      background-color: rgba(128, 128, 128, 0.09);

      .record-title {
        display: flex;
        align-items: center;
        width: 100%;
        color: #aaa;

        img {
          width: 16px;
          height: 16px;
        }

        .text {
          margin-left: 4px;
          color: rgba(16, 16, 16, 100);
          font-size: 16px;
          flex-shrink: 0;
        }

        .red {
          font-size: 14px;
          background: #FF8577;
          color: #fff;
          padding: 1px 8px;
          line-height: initial;
          border-radius: 4px;
          margin-left: 7px;
          flex-shrink: 0;
        }

        .date {
          margin-left: auto;
          flex-shrink: 0;
        }

        .state {
          // min-width: 54px;
          margin-left: 6px;
          margin-right: 6px;
          color: #999;
        }
      }

      .record-box {
        margin-top: 8px;
        min-height: 20px;
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0 10px;
        color: #AAA;

        .left {
          .line {
            margin-bottom: 8px;

            .red {
              color: #FF8577;
            }

            .black {
              color: #000;
            }
          }
        }

        .right {
          display: flex;
          flex-direction: column;

          .btn {
            margin-bottom: 4px;
          }
        }
      }
    }
  }
}
</style>
