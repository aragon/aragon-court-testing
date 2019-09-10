const fs = require('fs')
const path = require('path')
const { fork } = require('child_process')
const Network = require('./Network')
const Artifacts = require('./Artifacts')
const CourtDeployer = require('./CourtDeployer')

module.exports = class {
  constructor(network) {
    this.stats = {}
    this.network = new Network(network)
  }

  async run(process, config) {
    const court = await this._deployCourt(config)
    this.stats[court.address] = { started: 0, ended: 0 }
    this._loadActions(process, court)
  }

  async _deployCourt(config) {
    const { web3, provider, defaults } = await this.network.load()
    const artifacts = new Artifacts(provider, defaults)
    const deployer = new CourtDeployer(web3, artifacts)
    return deployer.call(config)
  }

  _loadActions(process, court) {
    this._actionsList().forEach(({ actionName, actionPath }) => {
      this.stats[court.address].started += 1
      const handler = require(path.resolve(actionPath, 'handler'))
      const action = fork(path.resolve(actionPath, 'progression'))

      action.on('message', async args => {
        console.log(`Handling message from ${actionName} #${action.pid} with args: ${args}`)
        await handler(court, args)
      })

      action.on('exit', code => {
        console.log(`Child process ${actionName} #${action.pid} exited with code ${code}`)
        this.stats[court.address].ended += 1
        const { started, ended } = this.stats[court.address]
        if (ended === started) process.exit(0)
      })
    })
  }

  _actionsList() {
    const actionsPath = path.resolve(__dirname, '../actions')
    return fs.readdirSync(actionsPath).map(file => ({ actionName: file, actionPath: path.resolve(actionsPath, file) }))
  }
}
