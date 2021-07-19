<template>
  <span></span>
</template>
<script>
export default {
  beforeCreate() {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en'
    this.$router.replace(`/${lang}/`)
  },
}
</script>
