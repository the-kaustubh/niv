const express = require('express')
const router = express.Router()
const User = require('../models/users')
const Node = require('../models/nodes')
const Reading = require('../models/readings')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authToken = require('../middleware/authToken')
const privilegeLevels = require('../models/usersPrivilege')

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const privilege = privilegeLevels.indexOf(req.body.designation)
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      institute: req.body.institute,
      designation: req.body.designation,
      privilege: privilege
    })
    const newUser = await user.save()
    res.status(200).json(newUser)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    username: req.body.username
  }).exec()
  if (user == null) {
    return res.status(400).json({ message: 'Cannot Find' })
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const data = {
        username: user.username,
        institute: user.institute,
        designation: user.designation
      }
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET)
      res.json(
        { accessToken: accessToken, designation: user.designation }
      )
    } else {
      res.json({ message: 'Not Allowed' })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/delete', authToken, async (req, res) => {
  try {
    if (req.user.privilege < req.body.privilege) {
      throw new Error(`Cannot delete user ${req.body.user}`)
    }

    User.deleteOne({
      username: req.body.username
    }, err => {
      throw new Error(err.message)
    })

    Node.deleteMany({
      user: req.body.username
    }, err => {
      throw new Error(err.message)
    })

    Reading.deleteMany({
      user: req.body.username
    }, err => {
      throw new Error(err.message)
    })
  } catch (e) {
    res.status(500).json({
      err: e.message
    })
  }
})

router.get('/about', authToken, async (req, res) => {
  res.status(200).json({
    user: req.user
  })
})

module.exports = router
