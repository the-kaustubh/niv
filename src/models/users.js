const mongoose = require('mongoose')

const VerificationSchema = new mongoose.Schema({
  isVerified: {
    type: Boolean,
    default: false
  },
  code: {
    type: String
  }
})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  privilege: {
    type: Number,
    required: true
  },
  institute: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  password: {
    type: String,
    required: true
  },
  mailSent: {
    type: Date
  },
  verification: {
    type: VerificationSchema,
    default: {
      isVerified: false,
      code: ''
    }
  },
  faulty: [{
    type: String
  }]
})

module.exports = mongoose.model('user', userSchema)
