const logger = require('../helpers/logger')('EventsBroker')

module.exports = class {
  constructor() {
    this.listeners = {}
    this.subscriptions = {}
  }

  addAndSubscribe(listener, events) {
    this.addListener(listener)
    events.forEach(event => this.subscribe(listener.pid, event))
    logger.info(`Listener #${listener.pid} subscribed to events: ${events.join(', ')}`)
  }

  addListener(listener) {
    if (!this.listeners[listener.pid]) {
      this.listeners[listener.pid] = listener
      this._subscribeListenerExit(listener)
    }
  }

  subscribe(pid, event) {
    if (!this.subscriptions[event]) {
      this.subscriptions[event] = []
    }
    this.subscriptions[event].push(pid)
  }

  publish(event, args) {
    if (this.subscriptions[event]) {
      this.subscriptions[event].forEach(pid => this.listeners[pid].send([event, args]))
    }
  }

  _subscribeListenerExit(listener) {
    listener.on('exit', code => {
      logger.info(`Listener process #${listener.pid} exited with code ${code}`)
      delete this.listeners[listener.pid]
      this._removeListenerSubscriptions(listener)
      if (Object.keys(this.listeners).length === 0) process.exit(0)
    })
  }

  _removeListenerSubscriptions(listener) {
    const events = Object.keys(this.subscriptions)
    events.forEach(event => {
      const listenerIndex = this.subscriptions[event].indexOf(listener.pid)
      if (listenerIndex > -1) this.subscriptions[event].splice(listenerIndex, 1)
    })
  }
}
