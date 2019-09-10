const logger = require('./logger')('Error Handler')

module.exports = function (error) {
  logger.error(`Process #${process.pid} finished with error:`)
  console.log(error)
  console.log()
  process.exit(1)
}
