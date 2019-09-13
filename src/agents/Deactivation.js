const Agent = require('../models/Agent')
const sleep = require('../helpers/sleep')
const logger = require('../helpers/logger')('Deactivation')

module.exports = class extends Agent {
  constructor(environment, court, options) {
    super(environment, court, options)

    const { jurors } = options
    Object.assign(this, { jurors })
  }

  async run() {
    const accounts = await this.environment.getAccounts()
    for (let i = 1; i < this.jurors; i *= 3) {
      await sleep(1)
      await this.court.deactivate(accounts[i], 1e18)
    }
  }

  onActivate(params, receipt) {
    logger.warn(`activate ${params} ${receipt}`)
  }
}
