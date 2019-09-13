const { fork } = require('child_process')
const logger = require('../helpers/logger')('Tester')
const EventsBroker = require('./EventsBroker')
const CourtDeployer = require('./CourtDeployer')

module.exports = class {
  constructor(network) {
    this.network = network
    this.broker = new EventsBroker()
    this.deployer = new CourtDeployer(network)
  }

  async run({ agents, court: courtConfig }) {
    const court = await this.deployer.call(courtConfig)
    this._loadAgents(agents, court)
  }

  _loadAgents(agents, court) {
    agents.map(({ name, path, processes, args }) => {
      for (let process = 0; process < processes; process++) {
        this._startAgent(court, path, name, args)
      }
    })
  }

  _startAgent(court, path, name, args) {
    const child = this._forkAgent(court, path, name, args)
    this._setChildMessagesHandler(child)
  }

  _forkAgent(court, path, name, args) {
    const child = fork('./bin/agent', this._agentArgs(court, path, args))
    logger.info(`Created process for '${name}' with pid #${child.pid}`)
    return child
  }

  _setChildMessagesHandler(child) {
    child.on('message', ([request, params]) => request === 'subscribe'
      ? this.broker.addAndSubscribe(child, params)
      : this.broker.publish(request, params)
    )
  }

  _agentArgs(court, path, args) {
    return Object.keys(args).reduce((list, argName) =>
      list.concat([`--${argName}`, args[argName]]),
      ['-n', this.network, '-c', court.address, '-p', path]
    )
  }
}
