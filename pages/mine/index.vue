<template>
  <div id="page-mine">
    <header>
      <img src="~/assets/img/logo.png" alt="logo" class="logo" />
      <div class="account">iwangyang@qq.com</div>
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
                fit="cover"
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
              {{ nftDict[e.class_uuid] }}
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>
<script>
import { createHash } from 'crypto'
import UnipassProvider from '@/assets/js/UnipassProvider.ts'

export default {
  data() {
    return {
      nftList: [],
      nftDict: {},
      provider: null,
    }
  },
  created() {
    const provider = this.checkLoign()
    this.init(provider)
  },
  methods: {
    async init(provider) {
      if (!provider) return
      const { Sea } = this
      const host = process.env.NUXT_ENV_JINSE
      // aven look
      console.log('🌊', provider._address.addressString)
      const address =
        'ckt1qsfy5cxd0x0pl09xvsvkmert8alsajm38qfnmjh2fzfu2804kq47vg3jksn3yfgasw29h9whngxp9len3fwvqulayfq'
      const res = await Sea.Ajax({
        url: `${host}/api/explorer/v1/holder_tokens/${address}`,
        data: {
          page: 1,
          limit: 1000,
          include_submitting: true,
        },
      })
      if (res.token_list) {
        const arr = Sea.set(res.token_list, 'class_uuid')
        for (const e of res.token_list) {
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
    checkLoign() {
      const provider = this.$store.state.provider
      if (provider) {
        return provider
      } else {
        this.$router.replace('/')
      }
    },
    async bindSign(message) {
      console.log('🌊message', message)
      const messageHash = createHash('SHA256')
        .update(message)
        .digest('hex')
        .toString()
      const data = await new UnipassProvider(
        process.env.NUXT_ENV_UNIPASS_URL,
      ).sign(messageHash)
      let signature = ''
      let pubkey = ''
      if (data.startsWith('0x')) {
        signature = data
      } else {
        const info = JSON.parse(data)
        pubkey = info.pubkey
        signature = `0x01${info.sign.replace('0x', '')}`
      }
      console.log('🌊pubkey', pubkey)
      console.log('🌊signature', signature)
    },
    bindNFT(nft) {
      nft.i_have = this.nftDict[nft.class_uuid]
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

          .nft-image {
            height: 50px;
            width: 50px;
            flex-shrink: 0;

            img {
              border: 1px solid #eee;
              border-radius: 4px;
            }
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
          color: var(--primary);
          font-size: 18px;
        }
      }

      .nft:active, .nft:hover {
        background: #eee;
      }
    }
  }
}
</style>
