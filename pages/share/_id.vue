<template>
  <div id="page-share">
    <back />
    <div id="red-box" ref="red-box" v-loading="loading">
      <!-- <img class="top-bg" src="~/assets/img/top-bg.png" @load="bindLoad" /> -->
      <div class="top-bg"></div>
      <template v-if="question">
        <div class="t1">{{ t_('question.t1') }}</div>
        <div class="t2">{{ t_('question.t2') }}</div>
        <div v-if="question" class="password">「{{ question }}」</div>
      </template>
      <template v-else>
        <div class="t1">{{ t_('password.t1') }}</div>
        <div class="t2">{{ t_('password.t2') }}</div>
        <div v-if="password" class="password">「{{ password }}」</div>
      </template>

      <div class="qrcode-box" :class="{ password: password }">
        <img v-if="QRCode" class="qrcode" :src="QRCode" />
      </div>
      <div class="t3">{{ t_('t3') }}</div>
      <div class="t4">{{ t_('t4') }}</div>
      <img v-if="png" class="share" :src="png" />
    </div>
    <div class="red-tip">{{ t_('tip') }}</div>
    <el-button class="red-share" type="primary" round @click="bindShare">
      {{ t_('btn') }}
    </el-button>
  </div>
</template>
<script>
// https://segmentfault.com/a/1190000011478657
import QRCode from 'qrcode'
import * as htmltoimage from "html-to-image"
export default {
  data() {
    return {
      QRCode: '',
      png: '',
      loading: true,
      shareUrl: '',
      password: this.$route.query.p || '',
      question: this.$route.query.q || '',
    }
  },
  mounted() {
    const host = window.location.origin
    const id = this.$route.params.id
    this.shareUrl = `${host}/gift/${id}/`
    if (this.question) {
      this.shareUrl += `?q=${encodeURIComponent(this.question)}`
    }
    this.initQRCode()
    this.bindLoad()
  },
  methods: {
    t_(key) {
      return this.$t(`share.${key}`)
    },
    bindLoad() {
      setTimeout(() => {
        this.$nextTick(() => {
          const redBox = this.$refs['red-box']
          htmltoimage.toPng(redBox, { pixelRatio: 3 }).then((dataUrl) => {
            this.png = dataUrl
          })
        })
      }, 800)
    },
    bindShare() {
      let v = `${this.t_('copiedContent4Cmd')}${this.shareUrl}`
      if (this.password) {
        v += `\n${this.t_('command')}：${this.password}`
      }
      if (this.question) {
        v = `${this.t_('copiedContent4Cmd')}${this.shareUrl}`
      }
      this.$clipboard(v)
      const password = this.password
        ? `<br>${this.t_('command')}：${this.password}`
        : ''
      this.$alert(
        `${this.t_('msgBoxContent')}<br>${this.shareUrl}${password}`,
        this.t_('msgBoxTitle'),
        {
          showConfirmButton: false,
          closeOnClickModal: true,
          closeOnPressEscape: true,
          dangerouslyUseHTMLString: true,
          type: 'info',
        },
      ).catch(() => {})
    },
    async initQRCode() {
      // https://www.npmjs.com/package/qrcode#example-1
      const url = await QRCode.toDataURL(this.shareUrl, {
        type: 'image/png',
        width: 260,
        margin: 1,
        color: {
          dark: '#FF6453FF',
          light: '#FFE2B0FF',
        },
      })
      this.QRCode = url
      this.loading = false
    },
  },
}
</script>
<style lang="stylus">
#page-share {
  --yellow: #FFE2B0;
  min-height: 100vh;
  padding: 42px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  #red-box {
    background: var(--primary);
    width: 320px;
    // height: 467px;
    // border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .canvas {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }

    .share {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }

    .top-bg {
      width: 100%;
      height: 102px;
      background: #f33b3d;
      border-radius: 0px 0px 60% 60%;
      border-bottom: 2px solid #ffd874;
    }

    .t1, .t2, .t3, .password, .t4 {
      padding: 0 10px;
    }

    .t1 {
      margin-top: 8px;
      font-size: 24px;
      color: rgb(250, 250, 250);
    }

    .t2 {
      margin-top: 12px;
      color: var(--yellow);
      text-align: center;
    }

    .password {
      margin-top: 8px;
      font-weight: bold;
      color: #fff;
      font-size: 20px;
      text-align: center;
    }

    .qrcode-box {
      position: relative;
      margin-top: 31px;
      padding: 8px;
      width: 150px;
      height: 150px;
      border: 2px solid var(--yellow);

      .rectangle {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .qrcode {
        width: 100%;
        height: 100%;
        // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
        // border: 2px dashed #ffe2b0;
      }
    }

    .qrcode-box.password {
      margin-top: 12px;
    }

    .t3 {
      margin-top: 4px;
      color: #ffbbbb;
      text-align: center;
    }

    .t4 {
      margin: 20px 0;
      color: var(--yellow);
      text-align: center;
    }
  }

  .red-tip {
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
  }

  .red-share {
    margin-top: 28px;
    width: 320px;
    background: var(--primary);
    border-color: var(--primary);
    color: var(--yellow);
  }
}
</style>
