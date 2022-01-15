const express = require('express')
const router = express.Router()
const { exec } = require('child_process')

router.get('/', async (_req, res) => {
  exec('git log -n 1', (err, stdout, _) => {
    if (err) res.send(err)
    else res.send(stdout)
  })
})

module.exports = router
