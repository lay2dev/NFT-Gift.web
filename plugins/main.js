import Vue from 'vue'
import Back from '@/components/back.vue'
import Sea from '@/assets/js/bigsea'
import Clipboard from 'v-clipboard'
// directive
// copy
Vue.use(Clipboard)
// components
Vue.component('Back', Back)
// global variable
Vue.prototype.Sea = Sea
