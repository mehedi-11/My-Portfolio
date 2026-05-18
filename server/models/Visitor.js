const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  country: { type: String, default: 'Unknown' },
  countryCode: { type: String, default: 'UN' },
  city: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Desktop' },
  browser: { type: String, default: 'Unknown' },
  page: { type: String, default: 'Portfolio Home' }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
