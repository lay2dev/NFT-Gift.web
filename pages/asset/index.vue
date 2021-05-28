<template>
  <div id="page-asset">
    <back />
    <div class="image-box">
      <el-image :src="nft.class_bg_image_url" fit="contain" alt="image" />
    </div>
    <div class="info-box">
      <div class="info">
        <header>
          <div class="name">{{ nft.class_name }}</div>
          <div class="description">{{ nft.class_description }}</div>
          <div class="user">
            <div class="user-name">
              <span>{{ nft.issuer_name }}</span>
              <el-image
                class="user-avator"
                :src="nft.issuer_avatar_url"
                alt="user-avator"
                fit="cover"
              >
                <template #error>
                  <div class="el-image__error"></div>
                </template>
              </el-image>
            </div>
            <div class="user-total">拥有 {{ nft.i_have }}</div>
          </div>
        </header>
        <main>
          <el-button
            type="primary"
            icon="el-icon-shopping-bag-1"
            @click="bindHandsel"
          >
            赠送
          </el-button>
        </main>
      </div>
    </div>
    <el-dialog
      :visible.sync="showSend"
      class="dialog-send"
      title="创建 NFT 红包"
      width="300px"
    >
      <el-form :model="form">
        <div class="i-have">
          您当前拥有
          <span :style="{ color: 'var(--primary)' }">{{ nft.i_have }}</span>
          个
        </div>
        <el-form-item label="赠送数量">
          <el-input-number
            v-model="form.number"
            :min="1"
            :max="nft.i_have"
            step-strictly
          ></el-input-number>
        </el-form-item>
        <el-form-item label="红包口令">
          <el-input
            v-model.trim="form.password"
            maxlength="16"
            show-word-limit
            placeholder="抢NFT红包，玩加密新社交"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSend = false">取消</el-button>
          <el-button type="primary" @click="bindSend">下一步</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  // getAddressByPubkey,
  // getDataFromSignString,
  // getKeyPassword,
  getPubkeyHash,
  generateKey,
  // decryptMasterKey,
} from '@/assets/js/ntf/utils'
export default {
  data() {
    return {
      form: {
        number: 1,
        password: '',
      },
      showSend: false,
      nft: {},
    }
  },
  created() {
    const nft = this.$store.state.nft
    if (nft && nft.i_have) {
      this.nft = nft
    } else {
      this.$router.replace('/mine')
    }
  },
  methods: {
    bindHandsel() {
      this.showSend = true
      const { password, number } = this.form
      const nft = this.$store.state.nft
      this.createRedPacketData({ nft, password, number })
    },
    bindSend() {
      this.$router.push('/share')
    },
    async createRedPacketData({ nft, password, number }) {
      const nfts = [nft]
      const redPacket = []
      const localAuth = []
      for (const item of nfts) {
        const { pubkey, pem } = await generateKey('generateKey', password)
        const outpoints = [
          {
            index: `0x${item.token_outpoint.index.toString(16)}`,
            txHash: item.token_outpoint.tx_hash,
          },
        ]
        redPacket.push({
          encrypt: pem,
          keyPubkey: pubkey,
          outpoints: JSON.stringify(outpoints),
          outpointSize: number,
        })
        localAuth.push({
          pubkeyHash: getPubkeyHash(pubkey),
          outpoints: [
            {
              index: `0x${item.token_outpoint.index.toString(16)}`,
              txHash: item.token_outpoint.tx_hash,
            },
          ],
        })
      }
      const authItemsBuffer = serializeLocalAuth(localAuth)
      const authItemsHex = `0x${authItemsBuffer.toString('hex')}`
      // this.redPacket = redPacket
      // this.message = authItemsHex
      console.log('🌊', redPacket, authItemsHex)
    },
  },
}
</script>
<style lang="stylus">
#page-asset {
  background: #eee;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .image-box {
    display: flex;
    justify-content: center;
    height: 343px;
    align-items: center;

    .el-image {
      width: 300px;
      height: 300px;
      border-radius: 4px;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.24);
      // will-change: transform;
      // transition: all 1000ms cubic-bezier(0.03, 0.98, 0.52, 0.99) 0s;
      // transform: perspective(1000px) rotateX(0deg) rotateY(15deg) scale3d(1, 1, 1);
    }
  }

  .info-box {
    flex: 1;
    display: flex;

    .info {
      background: rgb(250, 250, 250);
      width: 100%;
      border-radius: 25px 25px 0px 0px;
      box-shadow: rgb(0 0 0 / 6%) 0px 4px 2px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      >header {
        width: 100%;
        padding: 20px;

        .name {
          font-size: 18px;
        }

        .description {
          margin-top: 12px;
          font-size: 14px;
          line-height: 18px;
          color: #aaa;
          text-align: justify;
        }

        .user {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: rgba(0, 0, 0, 0.8);

          .user-name {
            display: flex;
            align-items: center;

            span {
              font-size: 14px;
            }

            img {
              margin-left: 4px;
              width: 18px;
              height: 18px;
            }
          }

          .user-total {
            font-size: 14px;
            color: #aaa;
          }
        }
      }

      >main {
        width: 100%;
        height: 20vh;
        background: white;
        border-radius: 35px 35px 0px 0px;
        box-shadow: rgb(0 0 0 / 6%) 0px 6px 2px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .dialog-send {
    .i-have {
      text-align: right;
      margin-bottom: -30px;
    }

    .el-input-number {
      width: 100%;
    }
  }
}
</style>
