const mongoose = require('mongoose');

const cabSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickup: String,
  drop: String,
  distance: String,
  fares: [Object],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CabSearch', cabSearchSchema);
