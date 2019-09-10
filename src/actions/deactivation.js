const sleep = require('../helpers/sleep')
const logger = require('../helpers/logger')('Deactivation')
const envLoader = require('../helpers/envLoader')
const errorHandler = require('../helpers/errorHandler')

async function run() {
  logger.info(`Deactivation action: #${process.pid}`)
  const { court, web3 } = await envLoader()
  const accounts = await web3.eth.getAccounts()

  process.on('message', args => {
    const [action, params, receipt] = args
    console.log(action)
    if (action === 'activate') {
      logger.warn(`activate ${params} ${receipt}`)
    }
  })

  for (let i = 1; i < 10; i *= 3) {
    await sleep(1)
    const params = [accounts[i], 1e18]
    const receipt = await court.deactivate(...params)
    process.send(['deactivate', params, receipt])
  }
}

run()
  .then(() => process.exit(0))
  .catch(errorHandler)
