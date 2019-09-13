const logger = require('../helpers/logger')('Court')

const EVENTS = [
  'heartbeat',
  'activate',
  'deactivate',
  'createDispute',
  'commit',
  'reveal',
  'appeal',
  'confirmAppeal',
]

class Court {
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

  async activate(juror, amount) {
    logger.success(`activating juror ${juror} with amount ${amount}`)
    const receipt = 'activation receipt'
    this._emit('activate', arguments, receipt)
  }

  async deactivate(juror, amount) {
    logger.success(`deactivating juror ${juror} with amount ${amount}`)
    const receipt = 'deactivation receipt'
    this._emit('deactivate', arguments, receipt)
  }

  _emit(event, args, receipt) {
    const params = [...args]
    process.send([event, [params, receipt]])
  }
}

Court.EVENTS = EVENTS

module.exports = Court
