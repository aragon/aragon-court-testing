const sleep = require('../../helpers/sleep')
const errorHandler = require('../../helpers/errorHandler')

async function run() {
  for (let i = 5; i < 10; i++) {
    await sleep(1)
    process.send([`juror ${i}`])
  }
}

run().catch(errorHandler)
