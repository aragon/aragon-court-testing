const Web3 = require('web3')
const Artifacts = require('./Artifacts')
const TruffleConfig = require('@truffle/config')

module.exports = class {
  constructor(network) {
    this.network = network
  }

  getWeb3() {
    const { provider } = this.getNetworkConfig()
    return new Web3(provider)
  }

  async getArtifacts() {
    let { from, gasPrice, gas, provider } = this.getNetworkConfig()
    if (!from) from = await this.getDefaultAccount()
    const defaults = { from, gasPrice, gas }
    return new Artifacts(provider, defaults)
  }

  async getAccounts() {
    return await this.getWeb3().eth.getAccounts()
  }

  async getDefaultAccount() {
    return (await this.getAccounts())[0]
  }

  getNetworkConfig() {
    if (!this.config) {
      this.config = TruffleConfig.detect({ logger: console })
      this.config.network = this.network
    }
    return this.config
  }
}
