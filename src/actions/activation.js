const sleep = require('../helpers/sleep')
const logger = require('../helpers/logger')('Activation')
const envLoader = require('../helpers/envLoader')
const errorHandler = require('../helpers/errorHandler')

async function run() {
  logger.info(`Activation action: #${process.pid}`)
  const { court, web3 } = await envLoader()
  const accounts = await web3.eth.getAccounts()

  process.on('message', args => {
    const [action, params, receipt] = args
    if (action === 'deactivate') {
      console.log(params)
      logger.warn(`deactivate ${params} ${receipt}`)
    }
  })

  for (let i = 1; i < 10; i++) {
    await sleep(1)
    const params = [accounts[i], i * 10e18]
    const receipt = await court.activate(...params)
    process.send(['activate', params, receipt])
  }

  throw new Error('asdfasdf')
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
