const express = require('express')

const router = express.Router()
const moment = require('moment')
const Node = require('../models/nodes')
const Reading = require('../models/readings')
const getNode = require('../middleware/getNode')

const reportMail = require('../util/reportMail')
const checkHealth = require('../util/checkHealthNodes')
const { updateNodeForUser } = require('../util/faultyNodesOfUsers')

router.post('/reading', getNode, async (req, res) => {
  try {
    if (req.body.backup === '1') {
      const dt = moment.unix(parseInt(req.body.datetime) - 19800).utc()
      req.body.datetime = new Date(dt)
    }
    req.cache.del(req.body.user)
    req.cache.del('master')

    // Disabling due to server error
    const isFaulty = checkHealth(req.body, req.node)
    updateNodeForUser(req.body.user, req.body.uid, isFaulty)
    if (isFaulty) {
      req.cache.setEx(`mail_${req.body.user}`, 30, 'yes')
      reportMail(req.body.user)
    }

    req.body.temperature = parseFloat(req.body.temperature) || 0
    req.body.humidity = parseFloat(req.body.humidity) || 0
    req.body.co2 = parseFloat(req.body.co2) || 0
    req.body.battery = parseFloat(req.body.battery) || 0

    const reading = new Reading(req.body)
    const savedReading = await reading.save()
    const newId = savedReading._id

    if (savedReading == null) {
      throw new Error('Could not save.')
    }

    const updatedNode = await Node.findOneAndUpdate(
      { uid: req.body.uid },
      {
        reading: newId
        // isCurrentlyFaulty: isFaulty
      }
    )

    if (updatedNode == null) {
      throw new Error('Could not save - ' + req.body.uid + '. Please check if node exists')
    }

    res.status(201).json({ msg: 'OK' })
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
