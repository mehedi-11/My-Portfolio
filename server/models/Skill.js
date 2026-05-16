const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g. "frontend", "backend"
  items: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
