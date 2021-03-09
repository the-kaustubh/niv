const express = require('express')
const router = express.Router()

router.get('/', (_req, res) => {
  res.status(200).json({ msg: 'Hey There' })
})

module.exports = router
