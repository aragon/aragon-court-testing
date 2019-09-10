const logger = require('../helpers/logger')('Court')

module.exports = class {
  constructor(court, jurorsRegistry, voting, subscriptions, accounting) {
    this.court = court
    this.jurorsRegistry = jurorsRegistry
    this.voting = voting
    this.subscriptions = subscriptions
    this.accounting = accounting
  }

  get address() {
    return this.court.address
  }

  async activate(juror) {
    logger.success('activating juror ', juror)
  }

  async deactivate(juror) {
    logger.success('deactivating juror ', juror)
  }
}
