const path = require('path')
const logger = require('../helpers/logger')('Tester')
const { fork } = require('child_process')
const Network = require('./Network')
const Artifacts = require('./Artifacts')
const EventsBroker = require('./EventsBroker')
const CourtDeployer = require('./CourtDeployer')

module.exports = class {
  constructor(network) {
    this.networkName = network
    this.broker = new EventsBroker()
    this.network = new Network(network)
  }

  async run({ actions, court: courtConfig }) {
    const court = await this._deployCourt(courtConfig)
    this._loadActions(actions, court)
  }

  async _deployCourt(config) {
    const { web3, provider, defaults } = await this.network.load()
    const artifacts = new Artifacts(provider, defaults)
    const deployer = new CourtDeployer(web3, artifacts)
    return deployer.call(config)
  }

  _loadActions(actions, court) {
    actions.map(action => {
      const actionPath = path.resolve(__dirname, `../actions/${action}`)
      const child = fork(actionPath, ['-n', this.networkName, '-c', court.address])
      logger.info(`Created process for '${action}' with pid #${child.pid}`)
      child.on('message', ([action, args]) => {
        if (action === 'subscribe') this.broker.addAndSubscribe(child, args)
        else this.broker.publish(action, args)
      })
    })
  }
}
