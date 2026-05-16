const mongoose = require('mongoose');

const HireSchema = new mongoose.Schema({
  company: { type: String, required: true },
  salary: { type: String, required: true },
  responsibilities: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Hire', HireSchema);
