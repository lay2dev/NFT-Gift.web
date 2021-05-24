// vue
import { createApp } from 'vue'
import App from './app.vue'
// element plus + i18n
import './assets/css/element-variables.scss'
import ElementPlus from 'element-plus'
import i18n from './assets/js/i18n.js'
// css
import './main.css'
// vuex
import store from './vuex.js'
// vue-router
import router from './router.js'
// create app
const app = createApp(App)
app
  .use(ElementPlus, { i18n: i18n.global.t })
  .use(i18n)
  .use(store)
  .use(router)
  .mount('#app')

import './assets/js/bigsea.js'
// ajax
Sea.Ajax.HOST = 'https://api.sea.team'
// ajax 默认参数
// Sea.Ajax.default = function () {
//   const data = {}
//   const token = Sea.localStorage('token')
//   if (token) {
//     data.token = token
//   }
//   return data
// }
// ajax 请求失败 统一处理
// Sea.Ajax.fail = (r) => {
//   this.$message.error(`请求失败 ${r.statusText}`)
// }
