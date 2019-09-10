const fs = require('fs')
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

  async run(process, config) {
    const court = await this._deployCourt(config)
    this._loadActions(process, court)
  }

  async _deployCourt(config) {
    const { web3, provider, defaults } = await this.network.load()
    const artifacts = new Artifacts(provider, defaults)
    const deployer = new CourtDeployer(web3, artifacts)
    return deployer.call(config)
  }

  _loadActions(process, court) {
    this._actionsList().map(({ actionName, actionPath }) =>  {
      const child = fork(actionPath, ['-n', this.networkName, '-c', court.address])
      child.on('message', ([action, args]) => {
        if (action === 'subscribe') {
          logger.info(`Action ${actionName} #${child.pid} subscribe to events [${args}]`)
          this.broker.addListener(child)
          args.forEach(event => this.broker.subscribe(child.pid, event))
        }
        else this.broker.publish(action, args)
      })
    })
  }

  _actionsList() {
    const actionsPath = path.resolve(__dirname, '../actions')
    return fs.readdirSync(actionsPath).map(file => ({ actionName: file, actionPath: path.resolve(actionsPath, file) }))
  }
}
