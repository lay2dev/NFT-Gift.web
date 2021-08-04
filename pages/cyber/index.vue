<template>
  <div id="page-cyber">
    <el-image
      class="background"
      fit="cover"
      :src="require('~/assets/img/cyber/background.jpg')"
    />
    <div class="btn-box">
      <div class="btn" type="primary" @click="bindGet">{{ btnText }}</div>
    </div>
  </div>
</template>
<script>
import Ticket from '~/pages/ticket/ticket.js'

export default {
  mixins: [Ticket],
  computed: {
    btnText() {
      if (this.state === 'success') {
        return '查看已领 NFT'
      } else if (this.state === 'fail') {
        return '领取 NFT'
      } else {
        return '登录并领取 NFT'
      }
    },
  },
  methods: {
    bindSuccess() {
      if (this.state) {
        Sea.open(process.env.UNIPASS_URL, true)
      } else {
        this.$message.success('领取成功')
      }
    },
    bindFail() {
      this.$message.error('NFT 已被领走')
    },
  },
}
</script>
<style lang="stylus">
#page-cyber {
  margin: 0 auto;
  max-width: 500px;
  position: relative;
  background: #EEE;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: fixed;
    // 高度 812px 距底 160px
    // 高度 667px 距底 90px
    // 求斜率 (160 - 90) / (812 - 667) = 0.48275862069
    // 667 * (160 - 90) / (812 - 667) - 90 = 232
    // bottom = h * 0.48275862069 - 232
    bottom: calc(100vh * (160 - 90) / (812 - 667) - 232px);
    right: 0;
    left: 0;
    user-select: none;

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      border-radius: 8px;
      padding: 9px 20px;
      background: rgba(68 143 202, 1);
      color: white;
    }

    .btn:hover {
      background: rgba(68 143 202, 0.8);
    }
  }
}

@media (min-width: 500px) {
  #page-ticket {
    min-height: 667px;
  }
}
</style>
