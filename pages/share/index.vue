<template>
  <div id="page-share">
    <back />
    <el-image :src="require('~/assets/img/top-bg.png')"></el-image>
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
}
</style>
