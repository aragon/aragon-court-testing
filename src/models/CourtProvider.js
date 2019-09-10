const CourtWrapper = require('./CourtWrapper')

const COURT_DEPENDENCIES_STORAGE_POSITIONS = {
  registry:       '0x0000000000000000000000000000000000000000000000000000000000000000',
  accounting:     '0x0000000000000000000000000000000000000000000000000000000000000001',
  voting:         '0x0000000000000000000000000000000000000000000000000000000000000002',
  subscriptions:  '0x0000000000000000000000000000000000000000000000000000000000000003',
}

module.exports = class {
  constructor(web3, artifacts) {
    this.web3 = web3
    this.artifacts = artifacts
  }

  async call(address) {
    const court = this.artifacts.require('Court').at(address)
    const jurorsRegistry = this._fetchJurorsRegistry(address)
    const accounting = this._fetchAccounting(address)
    const voting = this._fetchVoting(address)
    const subscriptions = this._fetchSubscriptions(address)
    return new CourtWrapper(court, jurorsRegistry, voting, subscriptions, accounting)
  }

  async _fetchJurorsRegistry(courtAddress) {
    const registryAddress = await this.web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.registry)
    return this.artifacts.require('JurorsRegistry').at(registryAddress.substring(0, 42))
  }

  async _fetchAccounting(courtAddress) {
    const accountingAddress = await this.web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.accounting)
    return this.artifacts.require('CourtAccounting').at(accountingAddress.substring(0, 42))
  }

  async _fetchVoting(courtAddress) {
    const votingAddress = await this.web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.voting)
    return this.artifacts.require('CRVoting').at(votingAddress.substring(0, 42))
  }

  async _fetchSubscriptions(courtAddress) {
    const subscriptionsAddress = await this.web3.eth.getStorageAt(courtAddress, COURT_DEPENDENCIES_STORAGE_POSITIONS.subscriptions)
    return this.artifacts.require('CourtSubscriptions').at(subscriptionsAddress.substring(0, 42))
  }
}
