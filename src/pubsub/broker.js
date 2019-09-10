module.exports = class {
  constructor(events) {
    this.children = []
    this.events = events
    console.log(events);
  }

  addChild(process, court) {
    if (this.children[process.pid]) {
      console.error(`Child exists ${process.pid}`)
      return
    }
    this.children[process.pid] = process

    //process.on('message', async (event, args) => {
    process.on('message', async ([event, ...args]) => {
      //const event = args[0]
      console.log(`Handling message for event ${event} from #${process.pid} with args: ${args}`)
      await this.events[event].handler(court, args)
    })
  }

  subscribe(pid, event) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(pid)
  }

  publish(event) {
    if (!this.events[event]) {
      return;
    }
    this.events[event].map(pid => this.children[pid].send([event]))
  }
}
