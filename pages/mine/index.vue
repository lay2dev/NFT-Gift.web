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
      <div class="nft-list">
        <template v-for="(e, i) in nftList">
          <div :key="i" class="nft" @click="bindNFT(e)">
            <div class="left">
              <el-image
                class="nft-image"
                :src="e.class_bg_image_url"
                alt="bg_image_url"
                fit="contain"
                lazy
                :preview-src-list="[e.class_bg_image_url]"
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
                {{ nftDict[e.class_uuid] }}
              </div>
              <div class="state" :class="e.tx_state">
                {{ stateDict[e.tx_state] }}
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="nftList.lenght === 0" class="not-found">
        <img src="~/assets/img/not_found.svg" />
        <div>你的资产宝箱里空空如也</div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nftList: [],
      nftDict: {},
      tokenList: [],
      stateDict: {
        pending: '接收中',
        submitting: '确认中',
        committed: '',
      },
      provider: null,
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
    async init() {
      // first page
      const res = await this.getList(1)
      if (res.token_list) {
        const tokenList = await this.initList(res)
        this.tokenList = Sea.deepCopy(tokenList)
        const arr = Sea.set(tokenList, 'class_uuid')
        for (const e of tokenList) {
          const id = e.class_uuid
          if (this.nftDict[id]) {
            this.nftDict[id] += 1
          } else {
            this.nftDict[id] = 1
          }
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
      nft.i_have = this.nftDict[nft.class_uuid]
      const nfts = this.tokenList.filter((e) => e.class_uuid === nft.class_uuid)
      this.$store.state.nfts = nfts
      this.$store.state.nft = nft
      this.$router.push('/asset')
    },
    bindExit() {
      Sea.localStorage('provider', '')
      this.$router.replace('/')
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
      margin-left: auto;
      width: 24px;
      height: 24px;
    }
  }

  >main {
    .nft-list {
      .nft {
        padding: 16px 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        >.left {
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

      .nft:active, .nft:hover {
        background: #eee;
      }
    }

    .not-found {
      text-align: center;
      font-weight: 300;
      font-size: 16px;
      margin: 10px;
    }
  }
}
</style>
