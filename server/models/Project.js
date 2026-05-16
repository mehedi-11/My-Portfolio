const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [String],
  image: { type: String },
  live: { type: String },
  github: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
