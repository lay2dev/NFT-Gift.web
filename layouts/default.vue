<template>
  <Nuxt />
</template>
<script>
export default {
  created() {
    const lang = this.$route.params.lang
    if (['zh', 'en'].includes(lang)) {
      this.$i18n.locale = lang
      Sea.lang = `/${lang}`
    } else {
      this.$i18n.locale = 'en'
      if (lang) {
        const fullPath = this.$route.fullPath
        this.$router.replace(`/en${fullPath}`)
      }
    }
  },
  mounted() {
    // Ajax default param
    // Sea.Ajax.default = function () {}
    // Ajax fail
    Sea.Ajax.fail = (r) => {
      this.$message.error(`${$t('requestFailed')} ${r.statusText}`)
    }
  },
}
</script>
