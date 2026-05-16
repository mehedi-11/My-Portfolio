const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g. "frontend", "backend"
  title: { type: String }, // e.g. "Frontend Architecture"
  description: { type: String }, // e.g. "Crafting beautiful, accessible, and high-performance user interfaces."
  items: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
