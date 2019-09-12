const logger = require('../helpers/logger')('Tester')
const nodePath = require('path')
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
    actions.map(({ name, path, processes, args }) => {
      const actionPath = nodePath.resolve(process.cwd(), path)
      for (let process = 0; process < processes; process++) {
        this._startActionProcess(court, actionPath, name, args)
      }
    })
  }

  _startActionProcess(court, actionPath, name, args) {
    const processArgs = Object.keys(args).reduce((list, argName) => list.concat([`--${argName}`, args[argName]]), [])
    const child = fork(actionPath, ['-n', this.networkName, '-c', court.address, ...processArgs])
    logger.info(`Created process for '${name}' with pid #${child.pid}`)
    child.on('message', ([request, params]) => {
      if (request === 'subscribe') this.broker.addAndSubscribe(child, params)
      else this.broker.publish(request, params)
    })
  }
}
