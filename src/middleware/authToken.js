require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/users')

async function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.json({ msg: 'Unauthorized' })
  let usr

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) throw new Error('Invalid User')
      usr = user
    })

    const userPresent = await User.findOne({
      username: usr.username
    }).populate('createdBy').exec()
    // console.log(userPresent)

    if (userPresent == null) {
      return res.json({ msg: 'Unauthorized' })
    }

    req.user = userPresent
    next()
  } catch (e) {
    console.err(e)
    res.json({ msg: e.message })
  }
}

module.exports = authenticateToken
