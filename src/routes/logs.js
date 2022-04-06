const express = require('express')
const router = express.Router()
const logPath = (process.env.LOGPATH) ? `${process.env.LOGPATH}/` : ''

router.get('/', async (_req, res) => {
  res.sendFile(`${logPath}ates_niv.error.log`)
})

router.get('/com', async (_req, res) => {
  res.sendFile(`${logPath}ates_niv.com.log`)
})

module.exports = router
