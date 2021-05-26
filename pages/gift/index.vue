<template>
  <div id="page-share">
    <back />
    <el-image :src="require('~/assets/img/top-bg.png')" />
    <template v-if="status === 'sucess'">
      <div class="sucess">
        <div class="t1">恭喜你</div>
        <div class="t2">领取成功</div>
      </div>
      <router-link to="/mine">
        <div class="balance">
          <el-image :src="require('~/assets/img/ze-balance-pay.svg')" />
          <div>打开钱包</div>
        </div>
      </router-link>
    </template>
    <template v-else-if="status === 'fail'">
      <div class="fail">
        <div class="t1">抱歉</div>
        <div class="t2">领取失败</div>
      </div>
      <div class="balance">
        <el-image :src="require('~/assets/img/ze-balance-pay.svg')" />
        <div>打开钱包</div>
      </div>
    </template>
    <template v-else>
      <div class="get">
        <div class="password">
          <el-input v-model="password" placeholder="输入红包口令"></el-input>
        </div>
        <div class="receive-box" @click="status = 'sucess'">
          <div class="receive">立即领取</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      status: 'sucess',
      password: '',
    }
  },
}
</script>
<style lang="stylus">
#page-share {
  background: #F35543;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .sucess, .fail {
    color: #ffe2b0;
    letter-spacing: 6px;
    padding-left: 6px;
    font-size: 20px;
    text-align: center;

    .t1 {
      margin-top: 107px;
    }

    .t2 {
      margin-top: 28px;
    }
  }

  .balance {
    margin-top: 106px;
    text-align: center;
    color: #000;
  }

  .get {
    .password {
      margin: 182px 56px 96px;

      .el-input__inner {
        text-align: center;
      }
    }

    .receive-box {
      display: flex;
      justify-content: center;

      .receive {
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 154px;
        height: 59px;
        border: 2px solid #FFE2B0;
        border-radius: 2px;
        color: #FFE2B0;
        font-size: 18px;
      }

      .receive:active {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>