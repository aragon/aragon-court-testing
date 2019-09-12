const { bn, bigExp } = require('@aragon/court/test/helpers/numbers')
const { NOW, ONE_DAY } = require('@aragon/court/test/helpers/time')

module.exports = {
  court: {
    governor:                           '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
    termDuration:                       bn(1),            //  terms lasts one second
    firstTermStartTime:                 bn(NOW + 120),    //  first term starts in 120 seconds
    commitTerms:                        bn(3),            //  vote commits last 3 terms
    revealTerms:                        bn(3),            //  vote reveals last 3 terms
    appealTerms:                        bn(3),            //  appeals last 3 terms
    appealConfirmTerms:                 bn(3),            //  appeal confirmations last 3 terms
    jurorFee:                           bigExp(10, 18),   //  10 fee tokens for juror fees
    heartbeatFee:                       bigExp(20, 18),   //  20 fee tokens for heartbeat fees
    draftFee:                           bigExp(30, 18),   //  30 fee tokens for draft fees
    settleFee:                          bigExp(40, 18),   //  40 fee tokens for settle fees
    penaltyPct:                         bn(100),          //  1% (1/10,000)
    finalRoundReduction:                bn(3300),         //  33% (1/10,000)
    appealStepFactor:                   bn(3),            //  each time a new appeal occurs, the amount of jurors to be drafted will be incremented 3 times
    maxRegularAppealRounds:             bn(3),            //  there can be up to 3 appeals in total per dispute
    jurorsMinActiveBalance:             bigExp(100, 18),  //  100 ANJ is the minimum balance jurors must activate to participate in the Court
    subscriptionPeriodDuration:         bn(ONE_DAY * 30), //  one month subscription period
    subscriptionFeeAmount:              bigExp(5, 18),    //  5 fee tokens for the subscription fees
    subscriptionPrePaymentPeriods:      bn(1),            //  1 subscription pre payment period
    subscriptionLatePaymentPenaltyPct:  bn(0),            //  none subscription late payment penalties
    subscriptionGovernorSharePct:       bn(0),            //  none subscription governor shares
  },
  agents: [
    {
      name: 'activation',
      path: './src/agents/Activation',
      processes: 1,
      args: {
        jurors: 20
      }
    },
    {
      name: 'deactivation',
      path: './src/agents/Deactivation',
      processes: 2,
      args: {
        jurors: 10
      }
    },
  ]
}
