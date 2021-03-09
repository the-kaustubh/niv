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
    type: Number,
    default: 0.0
  },
  humidity: {
    type: Number,
    default: 0.0

  },
  pressure: {
    type: Number,
    default: 0.0

  },
  co2: {
    type: Number,
    default: 0.0
  },
  datetime: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('reading', nodeSchema)
