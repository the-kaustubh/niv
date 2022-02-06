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
  sublocation: {
    type: String,
    required: true
  },
  machineName: {
    type: String,
    required: true
  },
  reading: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'reading'
  },
  isTemperature: {
    type: Boolean,
    required: true
  },
  isHumidity: {
    type: Boolean,
    required: true
  },
  isCO2: {
    type: Boolean,
    required: true
  },
  co2Range: {
    type: RangeSchema
  },
  pressureRange: {
    type: RangeSchema
  },
  temperatureRange: {
    type: RangeSchema
  },
  humidityRange: {
    type: RangeSchema
  },
  isCurrentlyFaulty: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  user: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('node', nodeSchema)
