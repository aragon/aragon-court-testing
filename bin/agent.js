#! /usr/bin/env node

const path = require('path')
const Environment = require('../src/models/Environment')
const errorHandler = require('../src/helpers/errorHandler')
const CourtProvider = require('../src/models/CourtProvider')

const parsedArgs = require('yargs')
  .option('court', { alias: 'c', describe: 'Court address', type: 'string', demand: true })
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
  .option('path', { alias: 'p', describe: 'Agent model path', type: 'string', demand: true })
  .argv

const mainArgs = ['network', 'n', 'court', 'c', 'path', 'p', '_', '$0']
const { network, court: courtAddress, path: agentPath } = parsedArgs
const customArgs = mainArgs.reduce((args, arg) => { delete args[arg]; return args }, parsedArgs)

async function run() {
  const Agent = require(path.resolve(process.cwd(), agentPath))
  const environment = new Environment(network)
  const courtProvider = new CourtProvider(network)
  const court = await courtProvider.call(courtAddress)
  const agent = new Agent(environment, court, customArgs)

  await agent.subscribe()
  await agent.run()
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
