const mongoose = require('mongoose')

const updatesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    required: true
  },
  entityId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('updates', updatesSchema)
