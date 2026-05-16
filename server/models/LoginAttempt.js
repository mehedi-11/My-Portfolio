const mongoose = require('mongoose');

const LoginAttemptSchema = new mongoose.Schema({
  username: { type: String },
  ip: { type: String },
  success: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('LoginAttempt', LoginAttemptSchema);
