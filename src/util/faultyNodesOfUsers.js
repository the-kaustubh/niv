const User = require('../models/users')

async function pushFaultyNode (username, uid) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $addToSet: { faulty: uid } }
    )
    console.info(updatedUser)
    if (!updatedUser) {
      throw new Error('Could not update faulty nodes')
    }
  } catch (err) {
    console.info(err)
  }
}

async function pullFaultyNode (username, uid) {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { $pull: { faulty: uid } }
    )
    console.info(updatedUser)
    if (!updatedUser) {
      throw new Error('Could not update faulty nodes')
    }
  } catch (err) {
    console.info(err)
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
