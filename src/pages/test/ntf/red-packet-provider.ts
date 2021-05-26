import { Provider, Platform, AddressType, Address } from '@lay2/pw-core';
import { getAddressByPubkey } from './utils';

export class RedPacketProvider extends Provider {
  constructor(
    masterPubkey: string,
    private masterAuth: string,
    private localAuth: string,
    private exchangeKey: CryptoKey,
    private exchangePubkey: string,
    private localAuthInfo: string
  ) {
    super(Platform.ckb);
    const addressStr = getAddressByPubkey(masterPubkey);
    this.address = new Address(addressStr, AddressType.ckb);
  }

  async init(): Promise<Provider> {
    return this;
  }

  async sign(message: string): Promise<string> {
    console.log('tx digest message', message);
    const sig = this.exchangeKey.sign(
      Buffer.from(message.replace('0x', ''), 'hex'),
      'hex'
    );

    const lock = Buffer.concat([
      Buffer.from(this.masterAuth.replace('0x', ''), 'hex'),
      Buffer.from(this.localAuth.replace('0x', ''), 'hex'),
      Buffer.from(this.exchangePubkey.replace('0x', ''), 'hex'),
      Buffer.from(sig.replace('0x', ''), 'hex'),
      Buffer.from(this.localAuthInfo.replace('0x', ''), 'hex')
    ]);
    const ret = '0x03' + lock.toString('hex');

    console.log('masterAuth', this.masterAuth);
    console.log('localAuth', this.localAuth);
    console.log('ret', ret);
    return ret;
  }

  async close() {
    console.log('do nothing');
  }
}
