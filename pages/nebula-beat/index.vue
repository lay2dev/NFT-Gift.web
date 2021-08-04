<template>
  <div id="page-ticket">
    <main>
      <el-image
        class="background"
        fit="cover"
        :src="require('~/assets/img/cyber/background.jpg')"
      />
      <div class="bottom">
        <div class="btn-box" @click="bindGet">
          <div class="btn">{{ btnText }}</div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import '~/pages/ticket/ticket.stylus'
import Ticket from '~/pages/ticket/ticket.js'

export default {
  mixins: [Ticket],
  computed: {
    btnText() {
      if (this.state === 'success') {
        return '查看已领 NFT'
      } else if (this.state === 'fail') {
        return '查看本次活动更多信息'
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
      if (this.state) {
        Sea.open(
          'https://chainsights.chaindd.com/cryptoart/#/?t1628057961424',
          true,
        )
      } else {
        this.$message.error('NFT 已被领走')
      }
    },
  },
}
</script>
