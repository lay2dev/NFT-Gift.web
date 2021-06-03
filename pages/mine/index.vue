<template>
  <div id="page-mine">
    <header>
      <img src="~/assets/img/logo.png" alt="logo" class="logo" />
      <div class="account">{{ account }}</div>
      <img
        src="~/assets/img/exit_to_app.svg"
        alt="exit"
        class="exit"
        @click="bindExit"
      />
    </header>
    <main>
      <el-collapse class="nft-list">
        <template v-for="(e, i) in nftList">
          <el-collapse-item :key="i" :class="{ checked: e.checked.length > 0 }">
            <template slot="title">
              <div :key="i" class="nft">
                <div class="left" @click.stop="bindNFT(e)">
                  <el-image
                    class="nft-image"
                    :src="e.class_bg_image_url"
                    alt="bg_image_url"
                    fit="contain"
                    lazy
                  />
                  <div class="info">
                    <div class="name">
                      {{ e.class_name }}
                    </div>
                    <div class="user">
                      <el-image
                        class="user-avator"
                        :src="e.issuer_avatar_url"
                        alt="user-avator"
                        fit="cover"
                        lazy
                      >
                        <template #error>
                          <div class="el-image__error" />
                        </template>
                      </el-image>
                      <div class="user-name">
                        {{ e.issuer_name }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right">
                  <div class="total">
                    {{ e.children && e.children.length }}
                  </div>
                  <div class="state" :class="e.tx_state">
                    {{ stateDict[e.tx_state] }}
                  </div>
                </div>
              </div>
            </template>
            <div class="nft-all">
              <el-checkbox
                v-model="e.checkAll"
                :indeterminate="e.isIndeterminate"
                @change="bindCheckAll($event, i)"
              >
                全选
              </el-checkbox>
            </div>
            <div class="nft-box">
              <el-checkbox-group
                v-model="e.checked"
                @change="bindCheckChange($event, i)"
              >
                <el-checkbox
                  v-for="nft in e.children"
                  :key="nft.n_token_id"
                  class="nft-one"
                  :label="nft.n_token_id"
                >
                  #{{ nft.n_token_id }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
      <div v-if="nftList.lenght === 0" class="not-found">
        <img src="~/assets/img/not_found.svg" />
        <div>你的资产宝箱里空空如也</div>
      </div>
    </main>
    <div v-show="showCheckBox" class="check-box">
      <el-button class="gift" @click="showGift = true">发红包</el-button>
      <div>已选择 {{ nftChecked.length }}</div>
      <i class="el-icon-close" @click="bindCheckBoxClose"></i>
    </div>
    <el-dialog :visible.sync="showAsset" fullscreen class="dialog-asset">
      <asset :nft="nft" />
    </el-dialog>
    <el-dialog
      :visible.sync="showGift"
      class="dialog-send"
      title="创建 NFT 红包"
      width="90%"
    >
    </el-dialog>
  </div>
</template>
<script>
import Asset from '~/components/mine-asset.vue'
export default {
  components: {
    Asset,
  },
  data() {
    return {
      nft: {
        children: [],
      },
      nftChecked: [],
      nftList: [],
      tokenList: [],
      stateDict: {
        pending: '接收中',
        submitting: '确认中',
        committed: '',
      },
      provider: null,
      showCheckBox: false,
      showAsset: false,
      showGift: true,
    }
  },
  computed: {
    account() {
      if (this.provider) {
        return this.provider._email
      }
      return ''
    },
  },
  mounted() {
    const provider = Sea.checkLogin()
    if (provider) {
      this.provider = provider
      this.init()
    } else {
      this.$router.replace('/')
    }
  },
  methods: {
    bindCheckBoxClose() {
      this.$confirm('退出后将清空当前的选择记录', '确定退出？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          for (let i = 0; i < this.nftList.length; i++) {
            this.nftList[i].checked = []
            this.nftList[i].isIndeterminate = false
            this.nftList[i].checkAll = false
          }
          this.checkList()
        })
        .catch(() => {})
    },
    async init() {
      // first page
      const res = await this.getList(1)
      if (res.token_list) {
        const tokenList = await this.initList(res)
        const list = Sea.set(tokenList, 'class_uuid')
        const arr = []
        for (const token of list) {
          const children = tokenList
            .filter((e) => e.class_uuid === token.class_uuid)
            .sort((a, b) => {
              return a.n_token_id - b.n_token_id
            })
          arr.push({
            ...token,
            children,
            isIndeterminate: false,
            checkAll: false,
            checked: [],
          })
        }
        this.nftList = arr
      }
    },
    async initList(res) {
      // be left over pages
      const maxPage = res.meta.max_page
      const promise = []
      for (let i = 2; i <= maxPage; i++) {
        promise.push(this.getList(i))
      }
      const resArr = await Promise.all(promise)
      const result = [...res.token_list]
      for (const item of resArr) {
        for (const nft of item.token_list) {
          result.push(nft)
        }
      }
      return result
    },
    getList(page) {
      const host = process.env.GOLDEN_LEGEND
      const address = this.provider._address.addressString
      return Sea.Ajax({
        url: `${host}/api/explorer/v1/holder_tokens/${address}`,
        data: {
          page,
          include_submitting: true,
        },
      })
    },
    bindNFT(nft) {
      this.nft = nft
      this.showAsset = true
    },
    bindExit() {
      Sea.localStorage('provider', '')
      this.$router.replace('/')
    },
    bindCheckAll(checkAll, i) {
      const all = this.nftList[i].children.map((e) => e.n_token_id)
      this.nftList[i].checked = checkAll ? all : []
      // checkAll
      this.nftList[i].checkAll = checkAll
      // isIndeterminate
      this.nftList[i].isIndeterminate = false
      // checkList
      this.checkList()
    },
    bindCheckChange(value, i) {
      const l = value.length
      const all = this.nftList[i].children.length
      // checkAll
      this.nftList[i].checkAll = l === all
      // isIndeterminate
      this.nftList[i].isIndeterminate = l > 0 && l < all
      // checkList
      this.checkList()
    },
    checkList() {
      const list = this.nftList
      const checked = []
      for (const item of list) {
        for (const e of item.children) {
          if (item.checked.includes(e.n_token_id)) {
            checked.push(e)
          }
        }
      }
      this.showCheckBox = checked.length > 0
      this.nftChecked = checked
    },
  },
}
</script>

<style lang="stylus">
#page-mine {
  >header {
    display: flex;
    align-items: center;
    background: var(--primary);
    padding: 7px 36px;
    margin: 10px;
    border-radius: 4px;

    .logo {
      width: 46px;
      height: 46px;
      user-select: none;
    }

    .account {
      margin-left: 12px;
      color: #fff;
    }

    .exit {
      cursor: pointer;
      margin-left: auto;
      width: 24px;
      height: 24px;
    }
  }

  >main {
    .nft-list {
      border: 0;
      margin-bottom: 80px;

      .checked {
        .el-collapse-item__header {
          border-bottom-color: var(--primary);
        }
      }

      .el-collapse-item__header {
        height: 100%;
        line-height: 100%;
        cursor: auto;
        border-bottom: 1px solid #F4F4F4;
        padding-right: 12px;
      }

      .el-collapse-item__wrap {
        border: 0;
      }

      .el-collapse-item__content {
        padding: 0;
      }

      .el-collapse-item__arrow {
        color: #c5c5c5;
        font-weight: bold;
      }

      .nft {
        width: 100%;
        padding: 16px 8px 16px 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        >.left {
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-right: 6px;

          .nft-image {
            background: #eee;
            height: 50px;
            width: 50px;
            flex-shrink: 0;
            box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.24);
            border-radius: 4px;
            overflow: hidden;
          }

          .info {
            margin-left: 10px;

            .name {
              color: rgba(16, 16, 16, 100);
              font-size: 16px;
              line-height: 16px;
            }

            .user {
              margin-top: 5px;
              display: flex;
              align-items: center;

              .user-avator {
                width: 18px;
                height: 18px;
                border-radius: 2px;
                flex-shrink: 0;
              }

              .user-name {
                font-size: 14px;
                margin-left: 6px;
                color: #aaa;
              }
            }
          }
        }

        .right {
          display: flex;
          align-items: center;

          .total {
            font-size: 18px;
            font-weight: 500;
          }

          .state {
            border-radius: 4px;
            color: white;
            padding: 2px 4px;
            margin-left: 8px;
          }

          .state.committed {
            padding: 0;
          }

          .state.pending {
            background: var(--primary);
          }

          .state.submitting {
            background: var(--success);
          }
        }
      }

      .nft-all {
        padding: 8px 22px 0;
        display: flex;
        justify-content: flex-end;
      }

      .nft-box {
        display: flex;
        flex-wrap: wrap;
        padding: 0 22px;

        .nft-one {
          margin-bottom: 14px;
          border-radius: 5px;
          background: #E6E6E6;
          margin-right: 24px;
          width: 50px;
          height: 26px;
          line-height: 26px;
          text-align: center;

          .el-checkbox__input {
            display: none;
          }

          .el-checkbox__label {
            padding-left: 0;
          }
        }

        .nft-one.is-checked {
          background: var(--primary);

          .el-checkbox__input.is-checked + .el-checkbox__label {
            color: #FFF;
          }
        }
      }
    }

    .not-found {
      text-align: center;
      font-weight: 300;
      font-size: 16px;
      margin: 10px;
    }
  }

  .check-box {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 35px 35px 0px 0px;
    box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.24);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;

    .gift {
      border-color: #FFE2B0;
      color: #FFE2B0;
      background: #F35543;
      margin-right: 20px;
    }

    .el-icon-close {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 20px;
    }
  }

  .dialog-asset {
    .el-dialog__header {
      padding: 0;

      .el-dialog__headerbtn {
        font-size: 24px;
        font-weight: 900;
        top: 8px;
        right: 8px;
      }
    }

    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
