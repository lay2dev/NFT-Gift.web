import { Builder, Amount, RawTransaction, Transaction } from '@lay2/pw-core'
export class RedPacketBuilder extends Builder {
  constructor(toAddress, cells, options, cellDeps, since) {
    super(options.feeRate, options.collector, options.witnessArgs)
    this.toAddress = toAddress
    this.cells = cells
    this.cellDeps = cellDeps
    this.since = since
  }

  async build(fee = Amount.ZERO) {
    const inputCells = []
    const outputCells = []

    if (this.cells.length === 0) {
      throw new Error(`no live cells, not neccessary to change lock`)
    }

    for (const cell of this.cells) {
      inputCells.push(cell)

      const outputCell = cell.clone()
      outputCell.lock = this.toAddress.toLockScript()
      outputCells.push(outputCell)
    }

    const rawTx = new RawTransaction(inputCells, outputCells, this.cellDeps)

    for (let i = 0; i < rawTx.inputs.length - 1; i++) {
      rawTx.inputs[i].since = this.since
    }
    const tx = new Transaction(rawTx, [this.witnessArgs])

    this.fee = Builder.calcFee(tx, this.feeRate)
    // this.fee = new Amount('10000', AmountUnit.shannon);
    const changeCell = tx.raw.outputs.pop()
    changeCell.capacity = changeCell.capacity.sub(this.fee)
    tx.raw.outputs.push(changeCell)
    return tx
  }
  getCollector() {
    return this.collector
  }
}
