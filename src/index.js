require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())

app.use(function (_req, res, next) {
  res.header('Content-Type', 'application/json')
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

mongoose.connect(
  process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })

const db = mongoose.connection
db.on('error', (err) => console.error(err))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors())

const nodeRouter = require('./routes/nodes')
app.use('/node', nodeRouter)

const userRouter = require('./routes/users')
app.use('/user', userRouter)

// const clientRouter = require('./routes/clients')
// app.use('/client', clientRouter)

const writeRouter = require('./routes/write')
app.use('/write', writeRouter)

app.get('/', (_req, res) => {
  res.json({ msg: 'Server Up' })
})

app.listen(process.env.PORT || 3000, () => console.log('Server Started'))

module.exports = app
