require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const compression = require('compression')
const initServer = require('./lib/InitServer')
const setupMasterUser = require('./util/setupMasterUser')
const logger = require('./logging/logging')

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

app.use(express.static(path.resolve(__dirname, 'public')))

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

const logsRouter = require('./routes/logs')
app.use('/logs', logsRouter)

app.get('/version', (_req, res) => {
  res.json({ version: '0.0.4' })
})

app.get(/.*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
  if (process.env.NODE_ENV === 'production') {
    initServer()
  }
  logger.info('Server started')
})

module.exports = app
