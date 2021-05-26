import { Provider, Platform, AddressType, Address } from '@lay2/pw-core'
import { signMessage } from '../utils'
export class RedPacketProvider extends Provider {
  constructor(
    masterPubkey,
    masterAuth,
    localAuth,
    exchangeKey,
    exchangePubkey,
    localAuthInfo,
  ) {
    super(Platform.ckb)
    this.masterAuth = masterAuth
    this.localAuth = localAuth
    this.exchangeKey = exchangeKey
    this.exchangePubkey = exchangePubkey
    this.localAuthInfo = localAuthInfo
    this.exchangeKey.setOptions({ signingScheme: 'pkcs1-sha256' })
    const { address: addressStr } = getAddressByPubkey(masterPubkey)
    this.address = new Address(addressStr, AddressType.ckb)
  }

  init() {
    return this
  }

  async sign(message) {
    console.log('tx digest message', message)

    const sig = this.exchangeKey.sign(
      Buffer.from(message.replace('0x', ''), 'hex'),
      'hex',
    )

    const lock = Buffer.concat([
      Buffer.from(this.masterAuth.replace('0x', ''), 'hex'),
      Buffer.from(this.localAuth.replace('0x', ''), 'hex'),
      Buffer.from(this.exchangePubkey.replace('0x', ''), 'hex'),
      Buffer.from(sig.replace('0x', ''), 'hex'),
      Buffer.from(this.localAuthInfo.replace('0x', ''), 'hex'),
    ])
    const ret = '0x03' + lock.toString('hex')

    console.log('masterAuth', this.masterAuth)
    console.log('localAuth', this.localAuth)
    console.log('ret', ret)
    return ret
  }
}
