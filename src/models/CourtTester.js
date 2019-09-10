const fs = require('fs')
const path = require('path')
const logger = require('../helpers/logger')('Tester')
const { fork } = require('child_process')
const Network = require('./Network')
const Artifacts = require('./Artifacts')
const CourtDeployer = require('./CourtDeployer')

module.exports = class {
  constructor(network) {
    this.networkName = network
    this.network = new Network(network)
  }

  async run(process, config) {
    const court = await this._deployCourt(config)
    this._loadActions(process, court)
    this._subscribeChildProcesses()
  }

  async _deployCourt(config) {
    const { web3, provider, defaults } = await this.network.load()
    const artifacts = new Artifacts(provider, defaults)
    const deployer = new CourtDeployer(web3, artifacts)
    return deployer.call(config)
  }

  _loadActions(process, court) {
    this.childProcesses = this._actionsList().map(({ actionName, actionPath }) =>  {
      const child = fork(actionPath, ['-n', this.networkName, '-c', court.address])
      return { actionName, child }
    })
  }

  _subscribeChildProcesses(childProcesses) {
    this.childProcesses.forEach(({ actionName, child }) => {
      // subscribe to child process executed actions to broadcast it through the rest of the children
      child.on('message', ([action, params, receipt]) => {
        logger.info(`Handling '${action}' action executed with args [${params}] and receipt (${receipt})`)
        this.childProcesses.forEach(({ child: anotherChild }) => anotherChild.send([action, params, receipt]))
      })

      // subscribe to child process exit, and exit once all have ended
      child.on('exit', code => {
        logger.info(`Child process ${actionName} #${child.pid} exited with code ${code}`)
        const childIndex = this.childProcesses.map(({ actionName, child }) => child.pid).indexOf(child.pid)
        if (childIndex > -1) this.childProcesses.splice(childIndex, 1)
        if (this.childProcesses.length === 0) process.exit(0)
      })
    })
  }

  _actionsList() {
    const actionsPath = path.resolve(__dirname, '../actions')
    return fs.readdirSync(actionsPath).map(file => ({ actionName: file, actionPath: path.resolve(actionsPath, file) }))
  }
}
