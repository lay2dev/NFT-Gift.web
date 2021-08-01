<template>
  <div id="page-error">Not found page</div>
</template>

<script>
export default {
  created() {
    // fix route lang bug
    const fullPath = this.$route.fullPath
    for (const lang of ['/en', '/zh']) {
      if (fullPath.startsWith(lang)) {
        this.$router.replace(fullPath.slice(lang.length))
      }
    }
  },
}
</script>
<style lang="stylus">
#page-error {
  justify-content: center;
}
</style>
