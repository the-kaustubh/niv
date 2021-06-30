const express = require('express')
const router = express.Router()
const Node = require('../models/nodes')
const User = require('../models/users')
const Reading = require('../models/readings')

const authenticateToken = require('../middleware/authToken')
const sendMailCSV = require('../util/mailCSV')

router.get('/', authenticateToken, async (req, res) => {
  try {
    let nodes
    if (req.user.privilege === 1 || req.user.privilege === 3) {
      nodes = await Node.find({ location: req.user.institute })
    } else {
      nodes = await Node.find({ user: req.user.username })
    }
    res.json(nodes)
  } catch (err) {
    res.json({ message: err.message })
  }
})

router.get('/readings/:uid', authenticateToken, async (req, res) => {
  const UID = req.params.uid
  let readings
  try {
    // if (!req.user.nodes.includes(UID)) {
    //   return res.sendStatus(403)
    // }
    readings = await Reading.find({
      uid: UID
    }).sort({
      datetime: -1
    })
    delete readings[0].__v
    res.status(200).json(readings[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/readings/all/:uid', authenticateToken, async (req, res) => {
  const UID = req.params.uid
  let readings
  try {
    // if (!req.user.nodes.includes(UID)) {
    //   return res.sendStatus(403)
    // }
    readings = await Reading.find({
      uid: UID
    }).sort()
    res.status(200).json(readings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/add', authenticateToken, async (req, res) => {
  req.body.user = req.user.username
  const node = new Node({
    uid: req.body.uid,
    location: req.body.location,
    machineName: req.body.machineName,
    user: req.user.username
  })
  const reading = new Reading({
    uid: req.body.uid,
    user: req.user.username
  })
  try {
    if (req.user.privilege > 2) {
      throw new Error('You are not allowed to change nodes')
    }
    const newNode = await node.save()
    const newReading = await reading.save()
    res.status(201).json({
      node: newNode,
      reading: newReading
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/modify', authenticateToken, getNode, async (req, res) => {
  const conditions = { uid: req.node.uid }
  const update = { $set: req.body }

  try {
    const newNode = await Node.findOneAndUpdate(conditions, update)
    res.status(201).json({ node: newNode })
  } catch (err) {
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
    res.status(200).json({
      message: 'Deleted Successfully'
    })
  } catch (err) {
    res.status(503).json({ message: err.message })
  }
})

router.get('/getcsv/:uid', async (req, res) => {
  try {
    const node = await Node.findOne({ uid: req.params.uid })
    const username = node.user
    const user = await User.findOne({ username: username })
    const readingsDB = await Reading.find({ uid: req.params.uid })
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

    const resp = sendMailCSV(req.params.uid, user.email, readingsToSend)
    if (resp) {
      res.json({ msg: 'File sent to mail: ' + user.email })
    } else throw new Error('Could not send mail')
  } catch (err) {
    res.json({ msg: err.message })
  }
})

async function getNode (req, res, next) {
  let node
  try {
    node = await Node.find({ uid: req.body.uid })
    if (node == null) {
      return res.status(404).json({ message: 'Cannot Find Node' })
    }
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
  req.node = node[0]
  next()
}

module.exports = router
