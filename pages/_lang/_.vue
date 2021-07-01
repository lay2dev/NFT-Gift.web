<template>
  <div id="page-error" @click="bindBack">Not found page</div>
</template>

<script>
export default {
  name: 'Error',
  data() {
    return {}
  },
  methods: {
    bindBack() {
      this.$router.push(Sea.lang + '/')
    },
  },
}
</script>
<style lang="stylus">
#page-error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
