const sleep = require('./sleep')
const Network = require('../models/Network')
const Artifacts = require('../models/Artifacts')
const CourtProvider = require('../models/CourtProvider')

module.exports = async function (subscriptions, expectedArgs = []) {
  const parsedArgs = expectedArgs.reduce((args, arg) => args.option(arg), require('yargs'))
    .option('court', { alias: 'c', describe: 'Court address', type: 'string', demand: true })
    .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
    .argv

  const { network: networkName, court: courtAddress } = parsedArgs
  const customArgs = expectedArgs.reduce((args, arg) => { args[arg] = parsedArgs[arg]; return args }, {})

  const network = new Network(networkName)
  const { web3, provider, defaults } = await network.load()
  const artifacts = new Artifacts(provider, defaults)

  const courtProvider = new CourtProvider(web3, artifacts)
  const court = await courtProvider.call(courtAddress)

  process.on('message', ([action, args]) => subscriptions[action](...args))
  await sleep(2)
  process.send(['subscribe', Object.keys(subscriptions)])

  return { web3, court, args: customArgs }
}
