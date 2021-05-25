<template>
  <div id="page-index">
    <div class="title">NFT GIFT</div>
    <router-link to="/mine">
      <el-button type="primary" round> 连接 Unipass </el-button>
    </router-link>
  </div>
</template>
<style lang="stylus">
#page-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding-top: 58px;
  padding-bottom: 100px;
  margin: 0 40px;

  a {
    width: 100%;

    .el-button {
      width: 100%;
    }
  }
}
</style>