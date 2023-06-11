require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const compression = require('compression')
const redis = require('redis')

// const initRedisCache = require('./cache/redis')
const cacheRoutes = require('./middleware/cacheRoutes')
const initServer = require('./lib/InitServer')
const setupMasterUser = require('./util/setupMasterUser')
const logger = require('./logging/logging')
const getUrl = require('./middleware/getUrl')
const { createBackup } = require('./util/dbBackup')
const { registerCRON } = require('./util/cronJob')

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
})
redisClient.on('error', err => {
  console.log('Error while connecting to redis ' + err)
})
redisClient.on('connect', () => {
  console.log('redis connected')
})
redisClient.connect()
mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })

app.use(express.json())
app.use(cors())
app.use(compression())
app.use(getUrl)

app.disable('etag')

app.use(cacheRoutes(redisClient))

const db = mongoose.connection
db.on('error', (e) => logger.error(e))
db.once('open', async () => {
  logger.log('info', 'Connected to Database')
  const status = await setupMasterUser()
  if (status !== null) {
    throw status
  }
})

const nodeRouter = require('./routes/nodes')
app.use('/node', nodeRouter)

const userRouter = require('./routes/users')
app.use('/user', userRouter)

const writeRouter = require('./routes/write')
app.use('/write', writeRouter)

const activitiesRouter = require('./routes/activities')
app.use('/activities', activitiesRouter)

const projectLogsRouter = require('./routes/logs')
app.use('/logs', projectLogsRouter)

const backupRouter = require('./routes/backup')
app.use('/backup', backupRouter)

const metaRouter = require('./routes/meta')
app.use('/meta', metaRouter)

const updatesRouter = require('./routes/autoUpdates')
app.use('/updates', updatesRouter)

registerCRON('0 */5 * * *', 'daily_backup', createBackup)

app.set('port', process.env.PORT || 3000)
console.log(app.get('port'))

app.listen(app.get('port'), () => {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NODE_ENV === 'production') {
      initServer()
    }
  }
  logger.info(`Server started in ${process.env.NODE_ENV} mode`)
})

module.exports = app
