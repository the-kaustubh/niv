const User = require('../models/users')

async function pushFaultyNode (username, uid) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $addToSet: { faulty: uid } }
    )
    if (updatedUser == null) {
      throw new Error('Could not updates faulty nodes')
    }
  } catch (err) {
    console.error(err)
  }
}

async function pullFaultyNode (username, uid) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $pull: { faulty: uid } }
    )
    if (updatedUser == null) {
      throw new Error('Could not updates faulty nodes')
    }
  } catch (err) {
    console.error(err)
  }
}

async function updateNodeForUser (username, uid, faulty) {
  if (faulty) {
    pushFaultyNode(username, uid)
  } else {
    pullFaultyNode(username, uid)
  }
}

module.exports = {
  updateNodeForUser
}
