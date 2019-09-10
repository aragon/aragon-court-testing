const chalk = require('chalk')

class Logger {
  constructor(actor) {
    this.actor = actor
  }

  info(msg) {
    this.log(msg, 'white')
  }

  success(msg) {
    this.log(msg, 'green')
  }

  warn(msg) {
    this.log(msg, 'yellow')
  }

  error(msg) {
    this.log(msg, 'red')
  }

  log(msg, color = 'white') {
    const formattedMessage = `[${this.actor}] ${msg}`
    console.error(chalk.keyword(color)(formattedMessage))
  }
}

module.exports = actor => new Logger(actor)
