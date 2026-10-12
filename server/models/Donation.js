const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    unique: true,
    default: () => 'DON-' + Math.floor(10000 + Math.random() * 90000)
  },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String, default: '+91 98765 43210' },
  pickupAddress: { type: String, default: 'Community Relief Center, Block A' },
  recipientName: { type: String, default: 'Local Relief Camp #4' },
  deliveryAddress: { type: String, default: 'Shelter Hub, Sector 9' },
  category: {
    type: String,
    enum: ['RATION_KIT', 'MEDICAL_SUPPLIES', 'CLOTHING', 'FINANCIAL', 'OTHER'],
    required: true
  },
  itemName: { type: String, default: 'Relief Aid Pack' },
  totalQuantity: { type: Number, required: true },
  unit: { type: String, default: 'Units' },
  qualityGrade: {
    type: String,
    enum: ['NEW_SEALED', 'EXCELLENT', 'STANDARD_GRADE'],
    default: 'NEW_SEALED'
  },
  estimatedValue: { type: Number, default: 0 },
  photoUrl: { type: String, default: '' },
  deliveryProofUrl: { type: String, default: '' },
  recipientConfirmation: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'LOGGED',
      'ASSIGNED',
      'PICKUP_SCHEDULED',
      'COLLECTED',
      'COLLECTION_CENTRE',
      'OUT_FOR_DELIVERY',
      'FULFILLED'
    ],
    default: 'LOGGED'
  },
  assignedVolunteer: { type: String, default: 'Unassigned' },
  assignedVolunteerEmail: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
