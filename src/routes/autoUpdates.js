const express = require('express')
const router = express.Router()
const { checkForUpdatesServer, checkForUpdatesClient } = require('../updates/checkUpstream')

router.get('/server/:token', async (req, res) => {
  const token = req.params.token
  console.log(token)
  checkForUpdatesServer(token)
  res.json({ msg: 'Checking for updates' })
})

router.get('/client/:token', async (req, res) => {
  const token = req.params.token
  console.log(token)
  checkForUpdatesClient(token)
  res.json({ msg: 'Checking for updates' })
})

module.exports = router
