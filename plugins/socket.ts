import { Address } from '@lay2/pw-core'
import IoClient from 'socket.io-client'

const URL = process.env.SOCKET_URL as string

export const InitSocket = (address: Address) => {
  const socket = IoClient(URL, {
    transports: ['websocket'],
  })

  if (socket !== undefined) {
    console.log('[socket-no-undefined]', socket.connected, URL)
    socket.on('connect', () => {
      console.log('[socket-connect]', address.addressString, socket.connected)
      const type = 'address'
      const value = address.addressString
      socket.emit('login', {
        type,
        value,
      })
    })

    socket.on('newTx', (data) => {
      // todo refresh
      console.log('[socket-newTx]', data)
      // window.location.reload()
    })
  }
}
