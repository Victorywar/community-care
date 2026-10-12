const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    enum: ['ADMIN', 'DONOR', 'VOLUNTEER', 'RECEIVER'],
    default: 'ADMIN'
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
