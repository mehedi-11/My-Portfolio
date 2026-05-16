const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  architecture: [{ type: String }],
  technicalHighlights: [{ type: String }],
  technologies: [{ type: String }],
  features: [{ type: String }],
  github: { type: String },
  live: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
