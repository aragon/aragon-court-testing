const sleep = require('../../helpers/sleep')
const errorHandler = require('../../helpers/errorHandler')

async function run() {
  for (let i = 0; i < 3; i++) {
    await sleep(1)
    process.send([`juror ${i}`])
  }
  throw new Error('asdfasdf')
}

run().catch(errorHandler)
