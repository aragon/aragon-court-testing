#! /usr/bin/env node

const path = require('path')
const CourtTester = require('./src/models/CourtTester')
const errorHandler = require('./src/helpers/errorHandler')

const { network, config: configFileName } = require('yargs')
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
  .option('config', { alias: 'c', describe: 'Config file name', type: 'string', default: './config', demand: true })
  .argv

async function run() {
  const config = require(path.resolve(__dirname, configFileName))
  const courtTester = new CourtTester(network)
  await courtTester.run(config)
}

run().catch(errorHandler)
