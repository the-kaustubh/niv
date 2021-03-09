require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/users')

async function authenticateToken (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  let usr

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    usr = user
  })

  const userPresent = await User.findOne({
    username: usr.username
  })

  if (userPresent == null) {
    return res.sendStatus(403)
  }

  req.user = userPresent

  next()
}

module.exports = authenticateToken
