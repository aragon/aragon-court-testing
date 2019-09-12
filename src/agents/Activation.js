const Agent = require('../models/Agent')
const sleep = require('../helpers/sleep')
const logger = require('../helpers/logger')('Activation')

module.exports = class extends Agent {
  constructor(environment, court, options) {
    super(environment, court, options)

    const { jurors } = options
    Object.assign(this, { jurors })
  }

  async run() {
    const accounts = await this.environment.getAccounts()
    for (let i = 1; i < this.jurors; i++) {
      await sleep(1)
      const params = [accounts[i], i * 10e18]
      const receipt = await this.court.activate(...params)
      process.send(['activate', [params, receipt]])
    }

    throw new Error('asdfasdf')
  }

  deactivationHandler(params, receipt) {
    logger.warn(`deactivate ${params} ${receipt}`)
  }
}
