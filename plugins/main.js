import Vue from 'vue'
import Clipboard from 'v-clipboard'
import InfiniteLoading from 'vue-infinite-loading'

import Back from '~/components/back.vue'
// directive
Vue.use(InfiniteLoading, {
  slots: {
    noResults: '',
    noMore: '',
  },
})
// copy
Vue.use(Clipboard)
// components
Vue.component('Back', Back)
