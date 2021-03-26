const express = require('express')
const router = express.Router()
const Reading = require('../models/readings')

router.post('/reading', async (req, res) => {
  try {
    if (req.body.backup === true) {
      const dt = req.body.datetime * 1000
      req.body.datetime = new Date(dt)
    }
    const reading = new Reading(req.body)
    const savedReading = await reading.save()
    if (savedReading == null) {
      throw new Error('Could not save.')
    }
    res.status(201).json(
      {
        msg: 'OK'
      }
    )
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

module.exports = router
