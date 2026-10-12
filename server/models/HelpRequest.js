const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    default: () => 'CC-' + Math.floor(1000 + Math.random() * 9000)
  },
  recipientName: {
    type: String,
    default: 'Community Recipient'
  },
  recipientEmail: {
    type: String,
    default: 'recipient@communitycare.org'
  },
  contactNumber: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Food'
  },
  itemName: {
    type: String,
    default: 'Relief Aid Pack'
  },
  quantityNeeded: {
    type: Number,
    default: 1
  },
  unit: {
    type: String,
    default: 'Packs'
  },
  urgency: {
    type: String,
    default: 'NORMAL'
  },
  description: {
    type: String,
    default: ''
  },
  deliveryAddress: {
    type: String,
    default: 'Local Community Shelter'
  },
  status: {
    type: String,
    default: 'PENDING'
  },
  assignedVolunteer: {
    type: String,
    default: 'Under Review'
  },
  recipientRemarks: {
    type: String,
    default: ''
  },
  receivedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);