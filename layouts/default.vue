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
      const defaultLang = navigator.language.startsWith('zh') ? 'zh' : 'en'
      this.$i18n.locale = defaultLang
      if (lang) {
        const fullPath = this.$route.fullPath
        this.$router.replace(`/${defaultLang}${fullPath}/`)
      }
    }
  },
  mounted() {
    // Ajax default param
    // Sea.Ajax.default = function () {}
    // Ajax fail
    Sea.Ajax.fail = (r) => {
      this.$message.error(`${this.$t('requestFailed')} ${r.statusText}`)
    }
  },
}
</script>
