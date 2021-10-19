const Update = require('../models/updates')

const actions = {
  CREATE: 0,
  UPDATE: 1,
  MODIFY: 1,
  DELETE: 2,
  RESERVED1: 3,
  RESERVED2: 4,
  RESERVED3: 5,
  LOGIN: 6,
  LOGOUT: 7
}

const entities = {
  USER: 0,
  NODE: 1
}

async function logUpdates (user, action, entity, entityId, status) {
  try {
    const updates = new Update({
      user: user,
      action: action,
      entity: entity,
      entityId: entityId,
      status: status
    })
    const updated = await updates.save()
    return updated
  } catch (e) {
    return e
  }
}

module.exports = {
  actions,
  entities,
  logUpdates
}
