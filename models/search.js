const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickup: String,
  drop: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Search', searchSchema);
