const sleep = require('../helpers/sleep')

const SUBSCRIPTIONS = {
  activate: 'activationHandler',
  deactivate: 'deactivationHandler',
}

module.exports = class {
  constructor(environment, court, options) {
    this.environment = environment
    this.court = court
    this.options = options
  }

  async run() {
    throw new Error('Agent subclass responsibility')
  }

  async subscribe() {
    const subscriptions = this.subscriptions()
    process.on('message', ([event, args]) => subscriptions[event](...args))
    await sleep(2) // TODO: solve concurrency
    process.send(['subscribe', Object.keys(subscriptions)])
  }

  subscriptions() {
    return Object.keys(SUBSCRIPTIONS).reduce((list, event) => {
      const handler = this[SUBSCRIPTIONS[event]]
      if (handler) list[event] = handler
      return list
    }, {})
  }
}
