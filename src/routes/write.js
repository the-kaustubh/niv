const express = require('express')
const router = express.Router()
const Node = require('../models/nodes')
const Reading = require('../models/readings')
const moment = require('moment')
// const checkHealthNodes = require('../util/checkHealthNodes')
// const reportMail = require('../util/reportMail')

router.post('/reading', async (req, res) => {
  try {
    if (req.body.backup === '1') {
      const dt = moment.unix(parseInt(req.body.datetime) - 19800).utc()
      req.body.datetime = new Date(dt)
    }
    await req.cache.del(req.body.user)
    await req.cache.del('master')

    const reading = new Reading(req.body)
    const savedReading = await reading.save()
    const newId = savedReading._id

    if (savedReading == null) {
      throw new Error('Could not save.')
    }

    const updatedNode = await Node.findOneAndUpdate(
      { uid: req.body.uid },
      { reading: newId }
    )

    if (updatedNode == null) {
      throw new Error('Could not save.')
    }

    res.status(201).json(
      {
        msg: 'OK'
      }
    )
  } catch (err) {
    console.err(err)
    res.status(500).json({ msg: err.message })
  }
})

router.get('/setpoints/:uid', async (req, res) => {
  try {
    const UID = req.params.uid
    const node = await Node.findOne({ uid: UID }, {
      co2Range: 1,
      temperatureRange: 1,
      humidityRange: 1
    })

    res.json({
      co2min: node?.co2Range?.min,
      co2max: node?.co2Range?.max,

      temperaturemin: node?.temperatureRange?.min,
      temperaturemax: node?.temperatureRange?.max,

      humiditymin: node?.humidityRange?.min,
      humiditymax: node?.humidityRange?.max
    })
  } catch (err) {
    console.err(err)
    res.send({ err: err.message })
  }
})

module.exports = router
