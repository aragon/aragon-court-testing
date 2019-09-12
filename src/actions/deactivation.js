const sleep = require('../helpers/sleep')
const logger = require('../helpers/logger')('Deactivation')
const actionLoader = require('../helpers/actionLoader')
const errorHandler = require('../helpers/errorHandler')

const ARGS = ['jurors']

const SUBSCRIPTIONS = {
  activate: activationHandler,
}

async function activationHandler(params, receipt) {
  logger.warn(`activate ${params} ${receipt}`)
}

async function run() {
  logger.info(`Deactivation action: #${process.pid}`)
  const { court, web3, args: { jurors } } = await actionLoader(SUBSCRIPTIONS, ARGS)

  const accounts = await web3.eth.getAccounts()
  for (let i = 1; i < jurors; i *= 3) {
    await sleep(1)
    const params = [accounts[i], 1e18]
    const receipt = await court.deactivate(...params)
    process.send(['deactivate', [params, receipt]])
  }
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
