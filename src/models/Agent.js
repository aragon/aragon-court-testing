const sleep = require('../helpers/sleep')
const { EVENTS } = require('../models/Court')

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
    await sleep(1) // TODO: solve concurrency
    process.send(['subscribe', Object.keys(subscriptions)])
  }

  subscriptions() {
    return EVENTS.reduce((list, event) => {
      const handlerName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`
      const handler = this[handlerName]
      if (handler) list[event] = handler
      return list
    }, {})
  }
}
