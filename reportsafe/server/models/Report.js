const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
