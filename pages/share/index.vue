<template>
  <div id="page-share">
    <back />
    <div id="red-box">
      <img class="top-bg" src="~/assets/img/top-bg.png" />
      <div class="t1">NFT 红包</div>
      <div class="t2">- 领取 NFT，尝试新玩法 -</div>
      <div class="qrcode-box">
        <img class="rectangle" src="~/assets/img/red-rectangle.png" alt="" />
        <div class="qrcode"></div>
      </div>
      <div class="t3">长按领取至钱包</div>
      <div class="t4">输入红包口令，获得专属于你的 NFT</div>
    </div>
    <div class="red-tip">长按图片分享给朋友</div>
    <el-button class="red-share" type="primary" round>分 享</el-button>
  </div>
</template>
<script>
// https://segmentfault.com/a/1190000011478657
import html2canvas from 'html2canvas'
export default {
  data() {
    return {
      password: '',
    }
  },
  mounted() {
    html2canvas(document.querySelector('#red-box')).then((canvas) => {
      document.body.appendChild(canvas)
    })
  },
}
</script>
<style lang="stylus">
#page-share {
  --red: #F35543;
  --yellow: #FFE2B0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  #red-box {
    background: var(--red);
    width: 320px;
    height: 467px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .top-bg {
      width: 320px;
      height: 111.51px;
    }

    .t1 {
      margin-top: 32px;
      font-size: 24px;
      color: rgb(250, 250, 250);
    }

    .t2 {
      margin-top: 12px;
      font-size: 14px;
      color: var(--yellow);
    }

    .qrcode-box {
      position: relative;
      margin-top: 24px;
      padding: 9px;
      width: 94px;
      height: 94px;

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
        // background: white;
        width: 100%;
        height: 100%;
        // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
        // border: 2px dashed #ffe2b0;
      }
    }

    .t3 {
      color: rgb(250, 250, 250);
    }

    .t4 {
      margin-top: auto;
      margin-bottom: 30px;
      color: var(--yellow);
    }
  }

  .red-tip {
    margin-top: 8px;
    font-size: 14px;
  }

  .red-share {
    margin-top: 28px;
    width: 320px;
    background: var(--red);
    border-color: var(--red);
  }
}
</style>
