const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  technologies: [String],
  architecture: [String],
  technicalHighlights: [String],
  live: { type: String },
  github: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
