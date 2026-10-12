const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['ADMIN', 'DONOR', 'VOLUNTEER', 'RECEIVER'], 
    required: true 
  },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  isApproved: { type: Boolean, default: false },
  rejectionReason: { type: String, default: null },
  isAvailable: { type: Boolean, default: true },
  activeTasksCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
