async function checkMasterPassword (req, res, next) {
  try {
    const match = req.body.masterPassword === process.env.MASTER_PWD
    if (match) {
      req.user = 'master'
      next()
    } else {
      throw new Error('You are not allowed to create users in this system')
    }
  } catch (err) {
    res.json({ msg: err.message })
  }
}

module.exports = checkMasterPassword
