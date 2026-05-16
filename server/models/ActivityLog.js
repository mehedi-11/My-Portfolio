const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'Added Project', 'Changed Password', 'Logged In'
  details: { type: String }, // e.g., 'Project: My Awesome App'
  category: { type: String, enum: ['CRUD', 'Auth', 'Security'], default: 'CRUD' },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
