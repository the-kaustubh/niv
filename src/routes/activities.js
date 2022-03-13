const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/authToken')
const Updates = require('../models/updates')

router.get('/', authenticateToken, async (_req, res) => {
  try {
    const updates = await Updates
      .find({})
      .sort({ datetime: 1 })
      .limit(30)
      .sort({ datetime: -1 })

    res.json({ updates })
  } catch (err) {
    res.json({ msg: err.message })
  }
})

module.exports = router
