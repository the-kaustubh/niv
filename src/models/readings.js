const mongoose = require('mongoose')
const nodeSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  pressure: {
    type: Number
  },
  co2: {
    type: Number
  },
  battery: {
    type: Number
  },
  datetime: {
    type: Date,
    required: true,
    default: Date.now
  }
})
module.exports = mongoose.model('reading', nodeSchema)
