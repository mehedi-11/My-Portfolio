const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  details: {
    type: String,
    required: true
  },
  image: {
    type: String, // Filename of the uploaded image
    required: true
  },
  tags: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
