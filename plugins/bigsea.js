import '@/assets/js/bigsea'
import dayjs from 'dayjs'
// global variable utils Sea
Sea.Ajax.HOST = process.env.NFT_GIFT
Sea.checkLogin = function () {
  const provider = Sea.localStorage('provider')
  if (provider && provider._address) {
    const passed = dayjs().diff(dayjs(provider._time || 0), 'hour')
    if (passed > 6) {
      Sea.localStorage('provider', '')
    } else {
      provider._time = Date.now()
      Sea.localStorage('provider', provider)
      return provider
    }
  }
  return null
}
