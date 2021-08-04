<template>
  <div id="page-ticket-3">
    <el-image
      class="background"
      fit="cover"
      :src="require('~/assets/img/ticket/background.png')"
    />
    <el-image
      v-show="state === ''"
      class="get"
      :src="require('~/assets/img/ticket/get-wait.png')"
    />
    <el-image
      v-show="state === 'success'"
      class="get"
      :src="require('~/assets/img/ticket/get-success.png')"
    />
    <el-image
      v-show="state === 'fail'"
      class="get"
      :src="require('~/assets/img/ticket/get-already.png')"
    />
    <div class="bottom">
      <div class="btn-box" @click="bindGet">
        <el-image class="btn" :src="require('~/assets/img/ticket/btn.svg')" />
        <div class="txt">{{ btnText }}</div>
      </div>
    </div>
    <Support />
  </div>
</template>
<script>
import Ticket from '~/pages/ticket/ticket.js'
import Support from '~/components/support.vue'

export default {
  components: [Support],
  mixins: [Ticket],
  methods: {
    bindSuccess() {
      if (this.state) {
        Sea.open(process.env.UNIPASS_URL, true)
      }
    },
    bindFail() {
      if (this.state) {
        Sea.open(process.env.UNIPASS_URL, true)
      }
    },
  },
}
</script>
<style lang="stylus">
#page-ticket-3 {
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

  .get {
    margin-top: 16vh;
    width: 299px;
    height: 340px;
  }

  .bottom {
    position: absolute;
    bottom: calc(100vh * (110 - 84) / (812 - 667) - 35px);
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn-box {
      cursor: pointer;
      position: relative;
      // margin-top: 15vh;
      // margin-bottom: 10vh;
      font-weight: bold;
      user-select: none;

      .txt {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 8px;
      }
    }
  }
}
</style>
