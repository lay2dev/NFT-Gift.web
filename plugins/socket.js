import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'
const URL = process.env.SOCKET_URL

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socketio(URL, {
      transports: ['websocket'],
    }),
  }),
)
