const { createLogger, format, transports } = require('winston')

const logPath = (process.env.LOGPATH) ? `${process.env.LOGPATH}/` : ''

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'niv-ates' },
  transports: [
    new transports.File({ filename: `${logPath}ates_niv.error.log`, level: 'error' }),
    new transports.File({ filename: `${logPath}ates_niv.com.log` })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }))
}

function overrideConsole (level) {
  return function (args) {
    logger.log(level, args)
  }
}
console.info = overrideConsole('info')
console.log = overrideConsole('info')
console.error = overrideConsole('error')

module.exports = logger
