const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  address: { type: String },
  statement: { type: String }, // About Section Statement
  github: { type: String },
  linkedin: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  website: { type: String },
  cvPath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
