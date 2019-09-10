const Web3 = require('web3')
const TruffleConfig = require('@truffle/config')

module.exports = class {
  constructor(network) {
    this.network = network
  }

  async load() {
    await this._loadTruffleConfig()
    await this._loadWeb3()
    await this._loadDefaults()

    const { web3, provider, defaults } = this
    return { web3, provider, defaults }
  }

  async _loadTruffleConfig() {
    this.config = TruffleConfig.detect({ logger: console })
    this.config.network = this.network
  }

  async _loadWeb3() {
    this.provider = this.config.provider
    this.web3 = new Web3(this.provider)
  }

  async _loadDefaults() {
    let { from, gasPrice, gas } = this.config
    if (!from) from = (await this.web3.eth.getAccounts())[0]
    this.defaults = { from, gasPrice, gas }
  }
}
