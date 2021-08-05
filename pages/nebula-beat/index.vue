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
        // 这样就跳到 /home
        this.open(process.env.MIBAO_URL + '/unipass?action=login')
      }
    },
    bindFail() {
      if (this.state) {
        // 这样就跳到 /explore
        this.open(
          process.env.MIBAO_URL + '/unipass?action=login&redirect=/explore',
        )
      }
    },
    open(openUrl) {
      const provider = Sea.localStorage('provider')
      const ret = {
        code: 200,
        info: 'login success',
        data: {
          email: provider._email,
          pubkey: provider._pubkey,
        },
      }
      const url = new URL(openUrl)
      url.searchParams.set('unipass_ret', JSON.stringify(ret))
      window.location.replace(url.href)
    },
  },
}
</script>
