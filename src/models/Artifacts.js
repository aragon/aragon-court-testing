const path = require('path')
const TruffleContract = require('@truffle/contract')

module.exports = class Artifacts {
  constructor(provider, defaults) {
    this.defaults = defaults
    this.provider = provider
  }

  require(contractName) {
    const schema = require(this._getBuildPath(contractName))
    const Contract = TruffleContract(schema)
    Contract.defaults(this.defaults)
    Contract.setProvider(this.provider)
    return Contract
  }

  _getBuildPath(contractName) {
    return path.resolve(process.cwd(), `./build/contracts/${contractName}.json`)
  }
}
