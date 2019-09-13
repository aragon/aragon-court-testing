#! /usr/bin/env node

const path = require('path')
const Tester = require('../src/models/Tester')
const errorHandler = require('../src/helpers/errorHandler')

const { network, config: configFileName } = require('yargs')
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
  .option('config', { alias: 'c', describe: 'Config file name', type: 'string', default: './config', demand: true })
  .argv

async function run() {
  const config = require(path.resolve(process.cwd(), configFileName))
  const tester = new Tester(network)
  await tester.run(config)
}

run().catch(errorHandler)
