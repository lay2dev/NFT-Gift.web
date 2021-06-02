import Vue from 'vue'
import Back from '@/components/back.vue'
import Clipboard from 'v-clipboard'
// directive
// copy
Vue.use(Clipboard)
// components
Vue.component('Back', Back)
