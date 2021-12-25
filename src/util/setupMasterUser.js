const User = require('../models/users')
const bcrypt = require('bcrypt')
const logger = require('../logging/logging')

async function setupMasterUser () {
  try {
    const exists = await User.findOne({
      email: process.env.FROM_EMAIL,
      username: 'master'
    })
    if (!exists) {
      const pwd = await bcrypt.hash(process.env.MASTER_PWD, 10)
      const master = new User({
        username: 'master',
        password: pwd,
        email: process.env.FROM_EMAIL,
        institute: process.env.INSTITUTE,
        designation: 'superadmin',
        privilege: 0
      })
      const saved = await master.save()
      if (saved !== null) {
        logger.error('Created Master user')
        return null
      }
    } else {
      logger.error('Master exists')
      return null
    }
  } catch (err) {
    console.err(err)
    return err
  }
}

module.exports = setupMasterUser
