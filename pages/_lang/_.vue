<template>
  <div></div>
</template>
<script>
export default {
  created() {
    const path = this.$route.path
    if (path.startsWith('/en') || path.startsWith('/zh')) {
      const list = path.split('/')
      list.shift()
      list.shift()
      const newPath = '/' + list.join('/')
      this.$router.replace(newPath)
    }
  },
}
</script>
