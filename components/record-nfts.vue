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
          <div class="token-id">
            <el-tag size="small">#{{ nft.tokenId }}</el-tag>
          </div>
          <div v-if="nft.txState === 'create'" class="update-time">
            {{ formatDate(nft.updateAt) }}
          </div>
        </div>
      </div>
      <div class="right">
        <template v-if="nft.txState === 'create'">
          <el-button
            size="medium"
            icon="el-icon-share"
            class="share"
            @click="bindShare(nft)"
          >
            分享
          </el-button>
          <el-button
            size="medium"
            icon="el-icon-refresh-left"
            class="cancel"
            @click="bindCancel(nft)"
          >
            撤销
          </el-button>
        </template>
        <template v-else-if="nft.txState === 'committed'">
          <el-button size="medium" icon="el-icon-search" @click="bindOpen(nft)">
            浏览器中查看
          </el-button>
          <div class="update-time">{{ formatDate(nft.updateAt) }}</div>
        </template>
        <template v-else>
          <div class="tx-state">{{ formatState(nft) }}</div>
          <div class="update-time">{{ formatDate(nft.updateAt) }}</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

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
    formatState({ txState, status }) {
      if (txState === 'init') {
        if (status === 'accept') {
          return '接收中'
        } else if (status === 'send') {
          return '发送中'
        }
      } else {
        return this.txStateDict[txState]
      }
    },
    formatDate(s) {
      return dayjs(s).format('YYYY-MM-DD HH:mm')
    },
    bindOpen(nft) {
      const host = process.env.NERVOS_EXPLORER
      Sea.open(`${host}${nft.txHash}`)
    },
    bindCancel(nft) {
      this.$emit('cancel', nft)
    },
    bindShare(nft) {
      this.$router.push(`/share/${nft.shortkey}`)
    },
  },
}
</script>
<style lang="stylus">
.record-nfts {
  padding: 0 15px;

  .nft {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .update-time {
      color: var(--text-placeholder);
    }

    .left {
      display: flex;
      align-items: center;

      .box {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin-right: 8px;

        .image {
          box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.24);
          width: 40px;
          height: 40px;
          border-radius: 4px;
        }

        .tip {
          margin-top: 4px;
          font-size: 12px;
          color: var(--text-secondary);
        }
      }

      .info {
        .title {
          color: rgba(16, 16, 16, 100);
          font-size: 14px;
          font-weight: bold;
        }

        .token-id {
          margin-top: 4px;
        }

        .update-time {
          margin-top: 4px;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .share {
      }

      .cancel {
        margin-top: 4px;
      }

      .update-time {
        margin-top: 4px;
      }
    }
  }
}
</style>
