<template>
  <div id="Error"></div>
</template>

<script>
export default {
  name: 'Error',
  data() {
    return {}
  },
  mounted() {
    this.$confirm('404 找不到该页面', {
      center: true,
      roundButton: true,
    })
      .then(() => {
        this.$router.go(-1)
      })
      .catch(() => {})
  },
}
</script>
