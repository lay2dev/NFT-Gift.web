import Vue from 'vue'
import Clipboard from 'v-clipboard'
import InfiniteLoading from 'vue-infinite-loading'

import Back from '~/components/back.vue'
// directive
// https://peachscript.github.io/vue-infinite-loading/zh/guide/configure-load-msg.html
Vue.use(InfiniteLoading, {
  slots: {
    noResults: { render: (h) => h('div') },
    noMore: { render: (h) => h('div') },
    error: { render: (h) => h('div') },
  },
})
// copy
Vue.use(Clipboard)
// components
Vue.component('Back', Back)
