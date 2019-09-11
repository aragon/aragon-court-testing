#! /usr/bin/env node

const path = require('path')
const CourtTester = require('./src/models/CourtTester')
const errorHandler = require('./src/helpers/errorHandler')

const { network, config: configFileName } = require('yargs')
  .option('n', { alias: 'network', describe: 'Network name', type: 'string' })
  .option('c', { alias: 'config', describe: 'Config file name', type: 'string', default: 'config' })
  .argv

async function run() {
  const config = require(path.resolve(__dirname, `./${configFileName}`))
  const courtTester = new CourtTester(network)
  await courtTester.run(config)
}

run().catch(errorHandler)
