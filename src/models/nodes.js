const mongoose = require('mongoose')

const RangeSchema = new mongoose.Schema({
  min: {
    type: Number
  },
  max: {
    type: Number
  }
})

const nodeSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  machineName: {
    type: String,
    required: true
  },
  co2Range: {
    type: RangeSchema,
    default: {
      min: 0,
      max: 100
    },
    required: true
  },
  pressureRange: {
    type: RangeSchema,
    default: {
      min: 0,
      max: 100
    },
    required: true
  },
  temperatureRange: {
    type: RangeSchema,
    default: {
      min: 0,
      max: 100
    },
    required: true
  },
  humidityRange: {
    type: RangeSchema,
    default: {
      min: 0,
      max: 100
    },
    required: true
  },
  user: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('node', nodeSchema)
