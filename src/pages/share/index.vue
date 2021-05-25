<template>
  <back />
  <div id="page-share">
    <el-image src="/src/pages/share/top-bg.png"></el-image>
    <div class="password">
      <el-input v-model="password" placeholder="输入红包口令"></el-input>
    </div>
    <div class="receive-box">
      <div class="receive">立即领取</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      password: '',
    }
  },
}
</script>
<style lang="stylus">
#page-share {
  background: #F35543;
  height: 100vh;

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
</style>