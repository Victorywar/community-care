const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

const RequestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientPhoto: { type: String, default: '' },
  
  // Admin Approval
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },

  // Donor Acceptance & Pledge
  donorName: { type: String, default: '' },
  donationType: { type: String, default: 'Supplies' }, // e.g. Cloth, Food, Medical
  donationPhoto: { type: String, default: '' },
  fundedAt: { type: Date },

  // Volunteer Dispatch Acceptance
  volunteerName: { type: String, default: '' },
  acceptedAt: { type: Date },
  pickupLocation: { type: String, default: '' },
  dispatchPhoto: { type: String, default: '' },

  // Final Delivery & Review
  completedAt: { type: Date },
  reviewStars: { type: Number, default: 5 },
  reviewComment: { type: String, default: '' },

  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'VERIFIED', 'FUNDED', 'DISPATCHED', 'COMPLETED'], 
    default: 'PENDING' 
  },
  timeline: [{
    stage: String,
    title: String,
    description: String,
    time: { type: Date, default: Date.now },
    actor: String
  }]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'RECIPIENT' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  address: { type: String, default: '' }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  role: { type: String, default: 'ALL' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// Profile APIs
app.get('/api/auth/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/auth/profile', async (req, res) => {
  try {
    const { email, name, phone, address, avatar, role } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name, phone, address, avatar, ...(role && { role }) },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Requests APIs
app.get('/api/requests', async (req, res) => {
  try {
    const list = await Request.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/requests', async (req, res) => {
  try {
    const { itemName, quantity, description, location, recipientName, recipientPhoto } = req.body;
    const newReq = await Request.create({
      itemName,
      quantity,
      description,
      location,
      recipientName,
      recipientPhoto,
      status: 'PENDING',
      timeline: [{
        stage: 'REQUESTED',
        title: 'Requisition Created',
        description: `${recipientName} requested ${quantity}x ${itemName}`,
        actor: recipientName
      }]
    });

    await Notification.create({
      role: 'ADMIN',
      title: '🚨 Pending Requisition Needs Approval',
      message: `${recipientName} submitted request for ${quantity}x ${itemName} at ${location}. Approval required!`
    });

    res.status(201).json(newReq);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Step-by-step Timeline & Accept Action
app.patch('/api/requests/:id/timeline-step', async (req, res) => {
  try {
    const { action, actor, donationType, photo, location, stars, comment } = req.body;
    const item = await Request.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Request not found' });

    if (action === 'ADMIN_APPROVE' || action === 'VERIFY') {
      item.status = 'ACCEPTED';
      item.verifiedBy = actor || 'Admin';
      item.verifiedAt = new Date();
      item.timeline.push({
        stage: 'ACCEPTED',
        title: 'Admin Approved & Accepted',
        description: `Approved by Administrator (${actor || 'Admin'}). Requisition pushed to Donor Network.`,
        actor: actor || 'Admin'
      });

      await Notification.create({
        role: 'DONOR',
        title: '📦 New Approved Aid Available',
        message: `Admin accepted ${item.quantity}x ${item.itemName}. Donors can now accept and provide supplies!`
      });
      await Notification.create({
        role: 'RECEIVER',
        title: '✅ Requisition Approved',
        message: `Your request for ${item.itemName} was approved by Admin and is visible to Donors.`
      });
    }
    else if (action === 'DONOR_ACCEPT' || action === 'DONATE') {
      item.status = 'FUNDED';
      item.donorName = actor || 'Donor';
      item.donationType = donationType || 'Supplies / Cloth';
      item.fundedAt = new Date();
      if (photo) item.donationPhoto = photo;
      item.timeline.push({
        stage: 'FUNDED',
        title: 'Donor Accepted & Provided Supplies',
        description: `Accepted by ${actor || 'Donor'} (${item.donationType}). Assigned to Volunteer fleet for pickup.`,
        actor: actor || 'Donor'
      });

      await Notification.create({
        role: 'VOLUNTEER',
        title: '🚚 Dispatch Ready: Pickup Required',
        message: `${actor || 'Donor'} provided ${item.donationType} for ${item.itemName}. Volunteers please accept dispatch!`
      });
      await Notification.create({
        role: 'ADMIN',
        title: '💰 Donor Accepted Requisition',
        message: `${actor || 'Donor'} accepted and provided supplies for #${item._id.toString().slice(-5)}.`
      });
    }
    else if (action === 'VOLUNTEER_ACCEPT' || action === 'ACCEPT_VOLUNTEER') {
      item.status = 'DISPATCHED';
      item.volunteerName = actor || 'Volunteer';
      item.acceptedAt = new Date();
      item.pickupLocation = location || 'Regional Depot';
      if (photo) item.dispatchPhoto = photo;
      item.timeline.push({
        stage: 'DISPATCHED',
        title: 'Volunteer Accepted & In Field Transit',
        description: `Accepted by Volunteer (${actor}). Pickup from ${item.pickupLocation}. Heading to recipient.`,
        actor: actor || 'Volunteer'
      });

      await Notification.create({
        role: 'RECEIVER',
        title: '🚗 Volunteer En Route',
        message: `Volunteer ${actor} accepted your aid parcel from ${item.pickupLocation} and is on the way!`
      });
    }
    else if (action === 'COMPLETE') {
      item.status = 'COMPLETED';
      item.completedAt = new Date();
      item.reviewStars = stars || 5;
      item.reviewComment = comment || 'Delivered successfully';
      item.timeline.push({
        stage: 'COMPLETED',
        title: 'Delivered & Handover Confirmed',
        description: `Received by recipient. Final review rating: ${item.reviewStars}★ ("${item.reviewComment}")`,
        actor: actor || 'Field Staff'
      });

      await Notification.create({
        role: 'ADMIN',
        title: '🎉 Complete Pipeline Closed',
        message: `${item.itemName} delivered safely. Rated ${item.reviewStars}★.`
      });
    }

    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const role = (req.query.role || 'ALL').toUpperCase();
    const list = await Notification.find({
      $or: [{ role: 'ALL' }, { role }]
    }).sort({ createdAt: -1 }).limit(30);
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/notifications/mark-read', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_care';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`CommunityCare Live on http://localhost:${PORT}`));
  })
  .catch(err => console.error("DB error:", err));