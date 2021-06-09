<template>
  <div id="page-create">
    <back>
      <router-link to="/record">红包记录</router-link>
    </back>
    <img class="bg" src="~/assets/img/bg.png" alt="backgorund" />
    <main>
      <div class="title">NFT 红包</div>
      <div class="subtitle">抢 NFT 红包，玩加密新社交</div>
      <div class="box select">
        <img src="~/assets/img/create_giftcard.svg" alt="create_giftcard" />
        <div class="text">
          <div class="t1">选择 NFT</div>
          <div class="t2">好友打开红包，即可领 NFT</div>
        </div>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="box number">
        <div class="left">
          <span>红包个数</span>
          <i class="el-icon-question"></i>
        </div>
        <div class="right">
          <input v-model.number="number" placeholder="填写个数" />
          <span>个</span>
        </div>
      </div>
      <div class="box password">
        <span>红包口令</span>
        <input v-model="password" type="text" />
        <div class="tip">对方输入口令，即可领取红包</div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      number: '',
      password: '恭喜发财',
    }
  },
}
</script>

<style lang="stylus">
#page-create {
  .bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  >main {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 43px 10px 0;

    .title {
      margin-top: 10px;
      color: rgba(255, 189, 132, 100);
      font-size: 20px;
      font-weight: bold;
    }

    .subtitle {
      margin-top: 21px;
      color: rgba(255, 189, 132, 68);
      font-size: 16px;
    }

    .box {
      width: 100%;
      line-height: 20px;
      background: rgba(255, 255, 255, 0.84);
      border-radius: 10px;
      color: rgba(16, 16, 16, 100);
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.44);
      border: 1px solid rgba(255, 255, 255, 100);
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    .box.select {
      padding: 16px 8px;
      margin-top: 23px;

      .text {
        margin-left: 5px;

        .t1 {
          color: rgba(16, 16, 16, 100);
          font-size: 18px;
        }

        .t2 {
          margin-top: 7px;
          left: 63px;
          color: rgba(170, 160, 160, 100);
          font-size: 12px;
        }
      }

      .el-icon-arrow-right {
        margin-left: auto;
        color: rgba(170, 160, 160, 100);
        font-size: 20px;
      }
    }

    .box.number {
      padding: 14px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 14px;
      padding-bottom: 14px;
      margin-top: 11px;

      input {
        background: transparent;
        border: 0;
        outline: 0;
        text-align: right;
        font-size: 16px;
      }
    }

    .box.password {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      padding: 14px 12px;
      margin-top: 31px;

      span {
        align-self: flex-start;
      }

      input {
        margin: 12px 0;
        border: 0;
        outline: rgba(255, 189, 132, 1);
        width: 336px;
        height: 38px;
        border-radius: 4px;
        background-color: rgba(255, 189, 132, 0.24);
        text-align: center;
        color: rgba(210, 123, 48, 100);
        font-size: 16px;
      }

      .tip {
        font-size: 12px;
      }
    }
  }
}
</style>
