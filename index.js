#! /usr/bin/env node

const CourtTester = require('./src/models/CourtTester')
const errorHandler = require('./src/helpers/errorHandler')

const { network } = require('yargs')
  .option('n', { alias: 'network', describe: 'Network name', type: 'string' })
  .argv

async function run(process) {
  const config = require('./court-config')
  const courtTester = new CourtTester(network)
  await courtTester.run(process, config)
}

run(process).catch(errorHandler)
