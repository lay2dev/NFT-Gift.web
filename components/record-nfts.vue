<template>
  <div v-loading="loading" class="record-nfts">
    <div v-for="(nft, i) in nfts" :key="i" class="nft">
      <div class="left">
        <div class="box">
          <img class="image" :src="nft.renderer" />
          <div class="tip">
            {{ nft.status === 'send' ? '发送红包' : '领取红包' }}
          </div>
        </div>
        <div class="info">
          <div class="title">{{ nft.name }}</div>
          <div class="token-id">#{{ nft.tokenId }}</div>
          <div v-if="nft.txState === 'create'" class="update-time">
            {{ nft.updateAt }}
          </div>
        </div>
      </div>
      <div class="right">
        <i v-if="nft.txState === 'create'" class="el-icon-share"></i>
        <div v-else class="tx-state">{{ txStateDict[nft.txState] }}</div>
        <el-button
          v-if="nft.txState === 'create'"
          size="mini"
          class="cancel"
          @click="bindCancel(nft)"
        >
          撤销
        </el-button>
        <el-button
          v-else-if="nft.txState === 'committed'"
          @click="bindOpen(nft)"
        >
          在浏览器中查看
        </el-button>
        <div v-else class="update-time">{{ nft.updateAt }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    nfts: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      txStateDict: {
        create: '创建红包',
        init: '领取中',
        pending: '确认中',
        committed: '领取完成',
        cancel: '已撤销',
        fail: '领取失败',
      },
    }
  },
  methods: {
    bindOpen(nft) {
      console.log('🌊', nft)
      //   env
      const host = 'https://explorer.nervos.org/aggron/transaction/'
      Sea.open(`${host}${nft.txHash}`)
    },
    bindCancel(nft) {
      this.$emit('cancel', nft)
    },
  },
}
</script>
<style lang="stylus">
.record-nfts {
  margin: 60px 15px 0;

  .nft {
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;

      .box {
        .image {
          box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.24);
          width: 40px;
          height: 40px;
        }

        .tip {
        }
      }

      .info {
        .title {
          color: rgba(16, 16, 16, 100);
          font-size: 14px;
        }

        .token-id {
        }

        .update-time {
        }
      }
    }

    .right {
    }
  }
}
</style>
