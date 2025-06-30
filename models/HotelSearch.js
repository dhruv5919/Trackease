const mongoose = require('mongoose');

const hotelSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: String,
  checkin: String,
  checkout: String,
  filters: Object,
  results: [Object],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HotelSearch', hotelSearchSchema);
