const sleep = require('../helpers/sleep')
const logger = require('../helpers/logger')('Activation')
const actionLoader = require('../helpers/actionLoader')
const errorHandler = require('../helpers/errorHandler')

const SUBSCRIPTIONS = {
  deactivate: deactivationHandler,
}

async function deactivationHandler(params, receipt) {
  logger.warn(`deactivate ${params} ${receipt}`)
}

async function run() {
  logger.info(`Activation action: #${process.pid}`)
  const { court, web3 } = await actionLoader(process, SUBSCRIPTIONS)

  const accounts = await web3.eth.getAccounts()
  for (let i = 1; i < 10; i++) {
    await sleep(1)
    const params = [accounts[i], i * 10e18]
    const receipt = await court.activate(...params)
    process.send(['activate', [params, receipt]])
  }

  throw new Error('asdfasdf')
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
