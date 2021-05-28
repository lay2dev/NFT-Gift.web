import { Signer, Provider, Blake2bHasher, Message } from '@lay2/pw-core'

export class UnipassSigner extends Signer {
  constructor(readonly providers: Provider[]) {
    super(new Blake2bHasher())
  }

  async signMessages(messages: Message[]) {
    const sigs = []

    for (const message of messages) {
      const matched = false
      console.log('[signMessages]', messages)
      for (const provider of this.providers) {
        console.log(
          '[signMessages-provider]',
          message.lock.toHash(),
          provider.address.toLockScript().toHash(),
        )
        sigs.push(await provider.sign(message.message))
      }

      if (!matched) {
        sigs.push('0x')
      }
    }
    return sigs
  }
}
