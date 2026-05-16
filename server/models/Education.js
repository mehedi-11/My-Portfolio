const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  result: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Education', educationSchema);
