require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const compression = require('compression')

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
db.on('error', (err) => console.error(err))
db.once('open', () => console.log('Connected to Database'))

app.get('/', (_req, res) => {
  res.sendFile('index.html')
})

const nodeRouter = require('./routes/nodes')
app.use('/node', nodeRouter)

const userRouter = require('./routes/users')
app.use('/user', userRouter)

const writeRouter = require('./routes/write')
app.use('/write', writeRouter)

app.get('/', (_req, res) => {
  res.json({ msg: 'Server Up' })
})

app.listen(process.env.PORT || 3000, () => console.log('Server Started'))

module.exports = app
