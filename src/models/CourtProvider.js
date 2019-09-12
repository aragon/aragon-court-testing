const Environment = require('./Environment')
const CourtWrapper = require('./CourtWrapper')

const COURT_DEPENDENCIES_STORAGE_POSITIONS = {
  registry:       '0x0000000000000000000000000000000000000000000000000000000000000000',
  accounting:     '0x0000000000000000000000000000000000000000000000000000000000000001',
  voting:         '0x0000000000000000000000000000000000000000000000000000000000000002',
  subscriptions:  '0x0000000000000000000000000000000000000000000000000000000000000003',
}

module.exports = class {
  constructor(network) {
    this.environment = new Environment(network)
  }

  async call(address) {
    const web3 = await this.environment.getWeb3()
    const artifacts = await this.environment.getArtifacts()

    const court = artifacts.require('Court').at(address)
    const jurorsRegistry = this._fetchJurorsRegistry(artifacts, web3, address)
    const accounting = this._fetchAccounting(artifacts, web3, address)
    const voting = this._fetchVoting(artifacts, web3, address)
    const subscriptions = this._fetchSubscriptions(artifacts, web3, address)

    return new CourtWrapper(court, jurorsRegistry, voting, subscriptions, accounting)
  }

  async _fetchJurorsRegistry(artifacts, web3, courtAddress) {
    const registryAddress = await web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.registry)
    return artifacts.require('JurorsRegistry').at(registryAddress.substring(0, 42))
  }

  async _fetchAccounting(artifacts, web3, courtAddress) {
    const accountingAddress = await web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.accounting)
    return artifacts.require('CourtAccounting').at(accountingAddress.substring(0, 42))
  }

  async _fetchVoting(artifacts, web3, courtAddress) {
    const votingAddress = await web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.voting)
    return artifacts.require('CRVoting').at(votingAddress.substring(0, 42))
  }

  async _fetchSubscriptions(artifacts, web3, courtAddress) {
    const subscriptionsAddress = await web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.subscriptions)
    return artifacts.require('CourtSubscriptions').at(subscriptionsAddress.substring(0, 42))
  }
}
