<template>
  <div id="page-error">{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // fix route lang bug
      const fullPath = this.$route.fullPath
      for (const lang of ['/en', '/zh']) {
        if (fullPath.startsWith(lang)) {
          this.$router.replace(fullPath.slice(lang.length))
          return
        }
      }
      this.message = 'Not found page'
    },
  },
}
</script>
<style lang="stylus">
#page-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
