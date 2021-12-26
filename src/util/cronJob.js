const cron = require('node-cron')

function registerCRON (cronString, name, fn) {
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

module.exports = {
  registerCRON
}
