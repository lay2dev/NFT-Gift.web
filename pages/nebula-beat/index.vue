<template>
  <div id="page-ticket">
    <main>
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
          <el-image :src="require('~/assets/img/ticket/btn.svg')" />
          <div class="txt">{{ btnText }}</div>
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
