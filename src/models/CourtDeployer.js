const CourtWrapper = require('./CourtWrapper')

const EXPECTED_COURT_CONFIG_PARAMS = [
  'governor',
  'termDuration',
  'firstTermStartTime',
  'commitTerms',
  'revealTerms',
  'appealTerms',
  'appealConfirmTerms',
  'jurorFee',
  'heartbeatFee',
  'draftFee',
  'settleFee',
  'penaltyPct',
  'finalRoundReduction',
  'appealStepFactor',
  'maxRegularAppealRounds',
  'jurorsMinActiveBalance',
  'subscriptionPeriodDuration',
  'subscriptionFeeAmount',
  'subscriptionPrePaymentPeriods',
  'subscriptionLatePaymentPenaltyPct',
  'subscriptionGovernorSharePct'
]

module.exports = class {
  constructor(web3, artifacts) {
    this.web3 = web3
    this.artifacts = artifacts
  }

  async call(config) {
    const params = await this._ensureCourtParams(config)
    const court = await this._deploy(params)
    const { jurorsRegistry, voting, subscriptions, accounting } = params
    return new CourtWrapper(court, jurorsRegistry, voting, subscriptions, accounting)
  }

  async _deploy(params) {
    return this.artifacts.require('Court').new(
      params.termDuration,
      [params.jurorToken.address, params.feeToken.address],
      params.jurorsRegistry.address,
      params.accounting.address,
      params.voting.address,
      params.subscriptions.address,
      [params.jurorFee, params.heartbeatFee, params.draftFee, params.settleFee],
      params.governor,
      params.firstTermStartTime,
      params.jurorsMinActiveBalance,
      [params.commitTerms, params.revealTerms, params.appealTerms, params.appealConfirmTerms],
      [params.penaltyPct, params.finalRoundReduction],
      params.appealStepFactor,
      params.maxRegularAppealRounds,
      [params.subscriptionPeriodDuration, params.subscriptionFeeAmount, params.subscriptionPrePaymentPeriods, params.subscriptionLatePaymentPenaltyPct, params.subscriptionGovernorSharePct]
    )
  }

  async _ensureCourtParams(config) {
    const params = config
    params.voting = await this.artifacts.require('CRVoting').new()
    params.accounting = await this.artifacts.require('CourtAccounting').new()
    params.feeToken = await this.artifacts.require('ERC20Mock').new('Court Fee Token', 'CFT', 18)
    params.jurorToken = await this.artifacts.require('ERC20Mock').new('Aragon Network Juror Token', 'ANJ', 18)
    params.jurorsRegistry =  await this.artifacts.require('JurorsRegistry').new()
    params.subscriptions = await this.artifacts.require('CourtSubscriptions').new()

    EXPECTED_COURT_CONFIG_PARAMS.forEach(param => {
      if (!params[param]) throw new Error(`Please provide a ${param} in the court config object`)
    })

    return params
  }
}
