const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Request Schema
const RequestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientPhoto: { type: String, default: '' },
  verifiedBy: { type: String, default: '' },
  donorName: { type: String, default: '' },
  volunteerName: { type: String, default: '' },
  donationType: { type: String, default: 'Supplies' },
  donationPhoto: { type: String, default: '' },
  dispatchPhoto: { type: String, default: '' },
  reviewStars: { type: Number, default: 5 },
  reviewComment: { type: String, default: '' },
  status: { type: String, default: 'PENDING' },
  timeline: [{
    stage: String,
    title: String,
    description: String,
    time: { type: Date, default: Date.now },
    actor: String
  }]
}, { timestamps: true });

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  role: { type: String, default: 'ALL' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// --- Notification Endpoints ---
app.get('/api/notifications', async (req, res) => {
  try {
    const role = (req.query.role || 'ALL').toUpperCase();
    const list = await Notification.find({
      $or: [{ role: 'ALL' }, { role }]
    }).sort({ createdAt: -1 }).limit(30);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/mark-read', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Request Endpoints ---
app.get('/api/requests', async (req, res) => {
  try {
    const data = await Request.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      title: '🚨 New Requisition Needs Approval',
      message: `${recipientName} requested ${quantity}x ${itemName} at ${location}.`
    });

    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/requests/:id/timeline-step', async (req, res) => {
  try {
    const { action, actor, donationType, photo, location, stars, comment } = req.body;
    const reqDoc = await Request.findById(req.params.id);
    if (!reqDoc) return res.status(404).json({ error: 'Request not found' });

    if (action === 'ADMIN_APPROVE' || action === 'VERIFY') {
      reqDoc.status = 'ACCEPTED';
      reqDoc.verifiedBy = actor || 'Admin Control';
      reqDoc.timeline.push({
        stage: 'ACCEPTED',
        title: 'Admin Accepted & Approved',
        description: `Verified by ${actor || 'Admin Control'}`,
        actor: actor || 'Admin Control'
      });

      await Notification.create({
        role: 'DONOR',
        title: '📦 New Approved Aid Available',
        message: `Admin approved ${reqDoc.quantity}x ${reqDoc.itemName} for ${reqDoc.recipientName}.`
      });
      await Notification.create({
        role: 'RECEIVER',
        title: '✅ Requisition Approved',
        message: `Your request for ${reqDoc.itemName} was approved and opened to donors.`
      });
    } else if (action === 'DONOR_ACCEPT' || action === 'DONATE') {
      reqDoc.status = 'FUNDED';
      reqDoc.donorName = actor || 'Donor';
      reqDoc.donationType = donationType || 'Supplies';
      if (photo) reqDoc.donationPhoto = photo;
      reqDoc.timeline.push({
        stage: 'FUNDED',
        title: 'Donor Accepted & Supplied',
        description: `Supplied by ${actor} (${reqDoc.donationType})`,
        actor
      });

      await Notification.create({
        role: 'VOLUNTEER',
        title: '🚚 Dispatch Ready for Pickup',
        message: `${actor} funded ${reqDoc.itemName}. Assigned for field transit.`
      });
    } else if (action === 'VOLUNTEER_ACCEPT' || action === 'ACCEPT_VOLUNTEER') {
      reqDoc.status = 'DISPATCHED';
      reqDoc.volunteerName = actor || 'Volunteer';
      reqDoc.timeline.push({
        stage: 'DISPATCHED',
        title: 'Volunteer Accepted Transit',
        description: `In transit by ${actor}`,
        actor
      });

      await Notification.create({
        role: 'RECEIVER',
        title: '🚗 Volunteer on the Way',
        message: `${actor} accepted delivery of ${reqDoc.itemName} and is in transit.`
      });
    } else if (action === 'COMPLETE') {
      reqDoc.status = 'COMPLETED';
      reqDoc.reviewStars = stars || 5;
      reqDoc.reviewComment = comment || 'Delivered safely';
      reqDoc.timeline.push({
        stage: 'COMPLETED',
        title: 'Handover Verified & Reviewed',
        description: `Signed off with ${reqDoc.reviewStars}★ ("${reqDoc.reviewComment}")`,
        actor: actor || 'Volunteer'
      });

      await Notification.create({
        role: 'ADMIN',
        title: '🎉 Complete Pipeline Closed',
        message: `${reqDoc.itemName} delivered safely and reviewed with ${reqDoc.reviewStars}★.`
      });
    }

    await reqDoc.save();
    res.json(reqDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_care';

mongoose.connect(MONGO_URI).then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Server READY on port ${PORT}`);
  });
}).catch(e => console.error("Mongo Error:", e));