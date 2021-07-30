import {
  Address,
  AddressType,
  BuilderOption,
  OutPoint,
  transformers,
} from '@lay2/pw-core'
import { getCellDeps, getCellsByOutpoints } from './cellDepsApi'
import { RedPacketBuilder } from './red-packet-builder'
import { RedPacketProvider } from './red-packet-provider'
import { UnipassSigner } from './unipass-signer'
import { getAddressByPubkey } from './utils'

/**
 * create transfer to get red packet
 * @param masterPubkey packet red retrun masterPubkey
 * @param masterAuth packet red retrun masterAuth
 * @param localAuthSig packet red retrun localAuthSig
 * @param exchangeKey packet red retrun key_pubkey decrypt crypto key par
 * @param exchangePubkey packet api retrun get key_pubkey
 * @param localAuthInfo packet api retrun localAuthSig
 * @param toAddress local users ckb address
 */
export async function redPacketTransfer(
  masterPubkey: string,
  authorization: string,
  localAuthSig: string,
  exchangeKey: CryptoKey,
  exchangePubkey: string,
  localAuthInfo: string,
  toAddress: string,
  outpoints: OutPoint[],
  ticket?: boolean,
) {
  const provider = new RedPacketProvider(
    masterPubkey,
    authorization,
    localAuthSig,
    exchangeKey,
    exchangePubkey,
    localAuthInfo,
    ticket,
  )

  const fromAddress = getAddressByPubkey(masterPubkey)
  console.log('fromAddress', fromAddress)
  console.log('masterPubkey', masterPubkey)
  console.log('[outpoints]', outpoints.length)
  const cells = await getCellsByOutpoints(outpoints)

  console.log('[cells]', cells)
  const inputCells = cells
  const lockLen =
    (1 + (8 + 256 * 2) * 3) * 2 + localAuthInfo.replace('0x', '').length
  console.log('lockLen', lockLen)
  const options: BuilderOption = {
    witnessArgs: {
      lock: '0x' + '0'.repeat(lockLen),
      input_type: '',
      output_type: '',
    },
  }
  console.log('options', options)
  const cellDeps = await getCellDeps()
  console.log('[celldeps]', cellDeps)
  try {
    const builder = new RedPacketBuilder(
      new Address(toAddress, AddressType.ckb),
      inputCells,
      options,
      cellDeps,
      ticket,
    )
    const signer = new UnipassSigner([provider])
    const tx = await builder.build()
    const txData = transformers.TransformTransaction(await signer.sign(tx))
    console.log('txData', JSON.stringify(txData))
    return JSON.stringify(txData)
  } catch (err) {
    console.log(err)
  }
}
