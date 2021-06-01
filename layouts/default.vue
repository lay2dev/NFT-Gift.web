<template>
  <div class="SeaTeam">
    <Nuxt />
  </div>
</template>
<script>
export default {
  mounted() {
    Sea.Ajax.HOST = process.env.NFT_GIFT
    // 默认参数
    // Sea.Ajax.default = function () {}
    // Ajax 请求失败返回值 统一处理
    Sea.Ajax.fail = (r) => {
      this.$message.error(`请求失败 ${r.statusText}`)
    }
  },
  methods: {},
}
</script>

<style lang="stylus">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
}

// 移动端适配
@media screen and (max-width: 500px) {
  .el-message, .el-message-box {
    width: 300px;
  }
}
</style>
