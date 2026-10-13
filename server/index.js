const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' })); // Support base64 photos

// Extended MongoDB Schema with Timeline history, photos, reviews
const RequestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  recipientId: { type: String, default: '' },
  recipientName: { type: String, required: true },
  recipientPhoto: { type: String, default: '' },
  
  // Verification
  verifiedBy: { type: String, default: '' },
  verifiedAt: { type: Date },

  // Donation
  donorName: { type: String, default: '' },
  donationPhoto: { type: String, default: '' },
  fundedAt: { type: Date },

  // Volunteer Dispatch
  volunteerName: { type: String, default: '' },
  acceptedAt: { type: Date },
  pickupLocation: { type: String, default: '' },
  dispatchPhoto: { type: String, default: '' },

  // Delivery & Review
  completedAt: { type: Date },
  reviewStars: { type: Number, default: 5 },
  reviewComment: { type: String, default: '' },

  status: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'FUNDED', 'DISPATCHED', 'COMPLETED'], 
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

// Profile Endpoints
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
    // Only real users from DB, 0 default mock names
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Requests & Workflow Timeline Endpoints
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
        title: 'Aid Request Submitted',
        description: `${recipientName} created aid requisition for ${quantity}x ${itemName}`,
        actor: recipientName
      }]
    });

    await Notification.create({
      role: 'ADMIN',
      title: '🚨 New Relief Request Submitted',
      message: `${recipientName} requested ${quantity}x ${itemName} at ${location}. Verification required.`
    });

    res.status(201).json(newReq);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Pipeline State Transitions with Timelines
app.patch('/api/requests/:id/timeline-step', async (req, res) => {
  try {
    const { action, actor, notes, photo, location } = req.body;
    const reqDoc = await Request.findById(req.params.id);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });

    if (action === 'VERIFY') {
      reqDoc.status = 'VERIFIED';
      reqDoc.verifiedBy = actor;
      reqDoc.verifiedAt = new Date();
      reqDoc.timeline.push({
        stage: 'VERIFIED',
        title: 'Request Approved & Verified',
        description: `Verified by Administrator (${actor}). Need opened to Donor Ledger.`,
        actor
      });
      await Notification.create({
        role: 'DONOR',
        title: '📦 New Verified Need Opened',
        message: `${reqDoc.itemName} (${reqDoc.quantity} units) approved by Admin for community funding.`
      });
    } 
    else if (action === 'DONATE') {
      reqDoc.status = 'FUNDED';
      reqDoc.donorName = actor;
      reqDoc.fundedAt = new Date();
      if (photo) reqDoc.donationPhoto = photo;
      reqDoc.timeline.push({
        stage: 'FUNDED',
        title: 'Donation Provided & Funded',
        description: `Contributed by Donor (${actor}). Waiting for volunteer field transit.`,
        actor
      });
      await Notification.create({
        role: 'VOLUNTEER',
        title: '🚚 Package Ready for Dispatch',
        message: `${actor} funded ${reqDoc.itemName}. Volunteer pickup required!`
      });
      await Notification.create({
        role: 'ADMIN',
        title: '💰 Aid Funded by Donor',
        message: `${actor} funded request #${reqDoc._id.toString().slice(-4)} (${reqDoc.itemName}).`
      });
    }
    else if (action === 'ACCEPT_VOLUNTEER') {
      reqDoc.status = 'DISPATCHED';
      reqDoc.volunteerName = actor;
      reqDoc.acceptedAt = new Date();
      reqDoc.pickupLocation = location || 'Regional Depot';
      if (photo) reqDoc.dispatchPhoto = photo;
      reqDoc.timeline.push({
        stage: 'DISPATCHED',
        title: 'Volunteer Accepted & In Transit',
        description: `Field transit accepted by ${actor}. Pickup scheduled at ${reqDoc.pickupLocation}.`,
        actor
      });
      await Notification.create({
        role: 'RECEIVER',
        title: '🚗 Volunteer on the Way',
        message: `${actor} accepted your aid delivery from ${reqDoc.pickupLocation}.`
      });
    }
    else if (action === 'COMPLETE') {
      reqDoc.status = 'COMPLETED';
      reqDoc.completedAt = new Date();
      reqDoc.reviewStars = req.body.stars || 5;
      reqDoc.reviewComment = req.body.comment || 'Successfully delivered';
      reqDoc.timeline.push({
        stage: 'COMPLETED',
        title: 'Handover Completed & Verified',
        description: `Aid handed over to recipient. Verified feedback: "${reqDoc.reviewComment}" (${reqDoc.reviewStars}★)`,
        actor
      });
      await Notification.create({
        role: 'ADMIN',
        title: '✅ Delivery Cycle Complete',
        message: `${reqDoc.itemName} was successfully delivered and reviewed with ${reqDoc.reviewStars} stars.`
      });
    }

    await reqDoc.save();
    res.json(reqDoc);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Notifications API
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
    app.listen(PORT, '0.0.0.0', () => console.log(`Backend live on http://localhost:${PORT}`));
  })
  .catch(err => console.error("Mongo Error:", err));