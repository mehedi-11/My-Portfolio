const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Frontend, Backend, Tools
  level: { type: Number, default: 80 }, // Percentage
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Skill', SkillSchema);
