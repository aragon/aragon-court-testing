const Environment = require('./Environment')
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
  constructor(network) {
    this.environment = new Environment(network)
  }

  async call(config) {
    const artifacts = await this.environment.getArtifacts()
    const params = await this._ensureCourtParams(artifacts, config)
    const court = await this._deploy(artifacts, params)
    const { jurorsRegistry, voting, subscriptions, accounting } = params
    return new CourtWrapper(court, jurorsRegistry, voting, subscriptions, accounting)
  }

  async _deploy(artifacts, params) {
    return artifacts.require('Court').new(
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

  async _ensureCourtParams(artifacts, config) {
    const params = config
    params.voting = await artifacts.require('CRVoting').new()
    params.accounting = await artifacts.require('CourtAccounting').new()
    params.feeToken = await artifacts.require('ERC20Mock').new('Court Fee Token', 'CFT', 18)
    params.jurorToken = await artifacts.require('ERC20Mock').new('Aragon Network Juror Token', 'ANJ', 18)
    params.jurorsRegistry =  await artifacts.require('JurorsRegistry').new()
    params.subscriptions = await artifacts.require('CourtSubscriptions').new()

    EXPECTED_COURT_CONFIG_PARAMS.forEach(param => {
      if (!params[param]) throw new Error(`Please provide a ${param} in the court config object`)
    })

    return params
  }
}
