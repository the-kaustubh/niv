const cron = require('node-cron')
const customLogger = require('../logging/customLogger')

function registerCRON (cronString, name, fn) {
  // const cronLogger = customLogger(name)
  console.error(`Registering new CRON job : '${name}'`)
  const isValid = cron.validate(cronString)
  if (!isValid) {
    console.error(
      `Failed to registering new CRON job : '${name}'. REASON: Invalid cron string [${cronString}]`
    )
    return
  }
  const cronJob = cron.schedule(cronString, fn)
  console.error(`Registered new CRON job : '${name}'`)
  cronJob.start()
  console.error(`Started CRON job : '${name}'`)
}

// function getAllCRONs () {
//   return [CRONList, cron.getTasks()]
// }

module.exports = {
  registerCRON
  // getAllCRONs
}
