const express = require('express')
const router = express.Router()
const Node = require('../models/nodes')
const Reading = require('../models/readings')

const authenticateToken = require('../middleware/authToken')
const getNode = require('../middleware/getNode')
const createCSV = require('../util/createCSV')

const { actions, entities, logUpdates } = require('../util/logUpdates')

const TIMEZONE_OFFSET = 19800000

router.get('/', authenticateToken, async (req, res) => {
  try {
    let nodes
    let cachedNodes = await req.cache.get(req.user.username)
    cachedNodes = JSON.parse(cachedNodes)

    // console.log(req.user.createdBy.username)
    if (cachedNodes && cachedNodes.length > 0) {
      res.json(cachedNodes)
    } else {
      switch (req.user.privilege) {
        case 0:
        case 1:
        case 3:
          nodes = await Node.find({ isArchived: false }, { __v: 0 }).populate('reading').exec()
          break
        case 2:
          nodes = await Node.find({ user: req.user.username, isArchived: false }, { __v: 0 }).populate('reading').exec()
          break
        case 4:
          nodes = await Node.find({ user: req.user.createdBy.username, isArchived: false }, { __v: 0 }).populate('reading').exec()
          break
        default:
          throw new Error('Invalid user')
      }
      req.cache.setEx(req.user.username, 300, JSON.stringify(nodes))
      res.json(nodes)
    }
  } catch (err) {
    console.error(err)
    res.json({ message: err.message })
  }
})

router.get('/readings/:uid', authenticateToken, async (req, res) => {
  const UID = req.params.uid
  let readings
  try {
    readings = await Reading.find({
      uid: UID
    }).sort({
      datetime: -1
    })
    delete readings[0].__v
    res.status(200).json(readings[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.get('/archived', authenticateToken, async (req, res) => {
  let nodes
  try {
    nodes = await Node.find({
      isArchived: true
    }).sort()
    res.status(200).json(nodes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.post('/add', authenticateToken, async (req, res) => {
  req.body.user = req.user.username
  const reading = new Reading({
    uid: req.body.uid,
    user: req.user.username
  })
  const node = new Node({
    uid: req.body.uid,
    location: req.body.location,
    sublocation: req.body.sublocation,
    machineName: req.body.machineName,
    user: req.user.username,
    isTemperature: req.body.isTemp,
    isHumidity: req.body.isHum,
    isCO2: req.body.isCO2,
    reading: reading._id,
    temperatureRange: {
      min: req.body?.temperatureRange?.min,
      max: req.body?.temperatureRange?.max
    },
    humidityRange: {
      min: req.body?.humidityRange?.min,
      max: req.body?.humidityRange?.max
    },
    co2Range: {
      min: req.body?.co2Range?.min,
      max: req.body?.co2Range?.max
    }
  })
  try {
    if (req.user.privilege > 2) {
      throw new Error('You are not allowed to change nodes')
    }
    const newNode = await node.save()
    const newReading = await reading.save()
    logUpdates(req.user.username, actions.CREATE, entities.NODE, newNode.uid, true)
    res.status(201).json({
      node: newNode,
      reading: newReading
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

router.post('/modify', authenticateToken, getNode, async (req, res) => {
  const conditions = { uid: req.node.uid }
  const update = { $set: req.body }

  try {
    const newNode = await Node.findOneAndUpdate(conditions, update)
    logUpdates(req.user.username, actions.UPDATE, entities.NODE, newNode.uid, true)
    req.cache.del(req.user.username)
    res.status(201).json({ node: newNode })
  } catch (err) {
    console.error(err)
    res.status(404).json({ message: err.message })
  }
})

router.delete('/:uid', authenticateToken, async (req, res) => {
  try {
    let tbd
    if (req.user.privilege > 2) {
      throw new Error('You are not allowed to change nodes')
    }
    if (req.user.privilege < 2) {
      tbd = await Node.findOne({
        uid: req.params.uid
      })
    } else {
      tbd = await Node.findOne({
        uid: req.params.uid,
        user: req.user.username
      })
    }
    if (tbd == null) {
      throw new Error('Nothing to delete')
    }
    Reading.deleteMany({ uid: tbd.uid }, (err) => {
      if (err) {
        throw new Error(err.message)
      }
    })
    Node.deleteOne({ uid: tbd.uid }, function (err) {
      if (err) {
        throw new Error(err.message)
      }
    })
    logUpdates(req.user.username, actions.DELETE, entities.NODE, tbd.uid, true)
    res.status(200).json({
      message: 'Deleted Successfully'
    })
  } catch (err) {
    console.error(err)
    res.status(503).json({ message: err.message })
  }
})

router.get('/getcsv/:uid', async (req, res) => {
  try {
    const uid = req.params.uid
    const readingsDB = await Reading.find({ uid: uid })
    const readingsToSend = []
    for (let i = 0; i < readingsDB.length; i++) {
      readingsToSend.push({
        uid: readingsDB[i].uid,
        user: readingsDB[i].user,
        datetime: readingsDB[i].datetime,
        pressure: readingsDB[i].pressure,
        humidity: readingsDB[i].humidity,
        co2: readingsDB[i].co2,
        temperature: readingsDB[i].temperature
      })
    }

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', `attachment; filename="data.${uid}.csv"`)
    await createCSV(readingsToSend, res)
  } catch (err) {
    console.error(err)
    res.json({ msg: err.message })
  }
})

router.get('/csv/:uid/:from/:to', async (req, res) => {
  try {
    const { uid, to, from } = req.params
    const dateFrom = new Date(Date.parse(from) - TIMEZONE_OFFSET)
    const dateTo = new Date(Date.parse(to) - TIMEZONE_OFFSET)

    const readingsDB = await Reading.find(
      {
        $and: [
          { uid: uid },
          {
            datetime: {
              $gte: dateFrom,
              $lte: dateTo
            }
          }
        ]
      },
      {
        _id: 0,
        datetime: 1,
        temperature: 1,
        humidity: 1,
        co2: 1
      })
    const csvData = createCSV(readingsDB)

    res.setHeader('Content-Type', 'text/plain')
    res.setHeader('Content-Disposition', `attachment; filename="data.${uid}.csv"`)
    res.write(csvData)
    res.end('')
  } catch (err) {
    console.error(err)
    res.json({ msg: err.message })
  }
})

router.post('/readings/all/', authenticateToken, async (req, res) => {
  const UID = req.body.uid
  const from = new Date(Date.parse(req.body.from) - TIMEZONE_OFFSET)
  const to = new Date(Date.parse(req.body.to) - TIMEZONE_OFFSET)
  let readings
  try {
    readings = await Reading.aggregate([
      {
        $match: {
          $and: [
            { uid: UID },
            {

              datetime: {
                $gte: from,
                $lte: to
              }
            }
          ]
        }
      },
      {
        $sample: {
          size: 500
        }
      },
      {
        $sort: {
          datetime: 1
        }
      }
    ])
    res.status(200).json(readings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.get('/search/:uid', authenticateToken, async (req, res) => {
  let node
  try {
    node = await Node.findOne({
      uid: req.params.uid
    })
      .populate('reading')
      .exec()
    res.json(node)
  } catch (e) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
