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
  role: { type: String, required: true }, // 'ADMIN', 'DONOR', 'VOLUNTEER', 'RECEIVER', 'ALL'
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientName: { type: String, default: '' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// Helper function to create notification cleanly
async function notify(role, title, message, recipientName = '') {
  try {
    await Notification.create({
      role: role.toUpperCase(),
      title,
      message,
      recipientName,
      read: false
    });
  } catch (err) {
    console.error('Notification create error:', err);
  }
}

// --- Notification Endpoints ---
app.get('/api/notifications', async (req, res) => {
  try {
    let reqRole = (req.query.role || 'ALL').toUpperCase();
    if (reqRole === 'RECIPIENT') reqRole = 'RECEIVER';

    const filter = {
      $or: [
        { role: 'ALL' },
        { role: reqRole }
      ]
    };

    if (req.query.user) {
      filter.$or.push({ recipientName: req.query.user });
    }

    const list = await Notification.find(filter).sort({ createdAt: -1 }).limit(40);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/mark-read', async (req, res) => {
  try {
    let role = (req.body.role || req.query.role || 'ALL').toUpperCase();
    if (role === 'RECIPIENT') role = 'RECEIVER';

    await Notification.updateMany(
      { $or: [{ role: 'ALL' }, { role }] },
      { $set: { read: true } }
    );
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

// 1. Recipient creates a request -> triggers ADMIN notification
app.post('/api/requests', async (req, res) => {
  try {
    const { itemName, quantity, description, location, recipientName, recipientPhoto } = req.body;
    const newReq = await Request.create({
      itemName,
      quantity,
      description,
      location,
      recipientName: recipientName || 'Receiver',
      recipientPhoto,
      status: 'PENDING',
      timeline: [{
        stage: 'REQUESTED',
        title: 'Requisition Created',
        description: `${recipientName || 'Receiver'} requested ${quantity}x ${itemName}`,
        actor: recipientName || 'Receiver'
      }]
    });

    await notify('ADMIN', '🚨 New Aid Request Pending Audit', `${recipientName || 'Receiver'} requested ${quantity}x ${itemName} at ${location}.`);
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Timeline step transitions -> triggers targeted notifications
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

      // Notify Donor & Receiver
      await notify('DONOR', '📦 New Verified Need Open for Donation', `${reqDoc.quantity}x ${reqDoc.itemName} for ${reqDoc.recipientName} is approved and ready for funding.`);
      await notify('RECEIVER', '✅ Aid Requisition Approved', `Your request for ${reqDoc.itemName} was approved by Admin and routed to donors.`, reqDoc.recipientName);

    } else if (action === 'DONOR_ACCEPT' || action === 'DONATE') {
      reqDoc.status = 'FUNDED';
      reqDoc.donorName = actor || 'Community Donor';
      reqDoc.donationType = donationType || 'Supplies';
      if (photo) reqDoc.donationPhoto = photo;
      reqDoc.timeline.push({
        stage: 'FUNDED',
        title: 'Donor Accepted & Supplied',
        description: `Supplied by ${actor} (${reqDoc.donationType})`,
        actor
      });

      // Notify Volunteer & Receiver
      await notify('VOLUNTEER', '🚚 New Delivery Job Available', `${actor} supplied ${reqDoc.quantity}x ${reqDoc.itemName}. Ready for transit pickup!`);
      await notify('RECEIVER', '🎁 Aid Funded by Donor', `${actor} accepted to supply your request for ${reqDoc.itemName}.`, reqDoc.recipientName);

    } else if (action === 'VOLUNTEER_ACCEPT' || action === 'ACCEPT_VOLUNTEER') {
      reqDoc.status = 'DISPATCHED';
      reqDoc.volunteerName = actor || 'Volunteer Runner';
      reqDoc.timeline.push({
        stage: 'DISPATCHED',
        title: 'Volunteer Accepted Transit',
        description: `In transit by ${actor} from ${location || 'Central Depot'}`,
        actor
      });

      // Notify Receiver & Admin
      await notify('RECEIVER', '🚗 Volunteer En Route with Your Aid', `${actor} has picked up ${reqDoc.itemName} and is on the way to ${reqDoc.location}!`, reqDoc.recipientName);
      await notify('ADMIN', '🚚 Transit Dispatched', `${actor} has accepted delivery run for #${reqDoc._id.toString().slice(-5)}.`);

    } else if (action === 'COMPLETE') {
      reqDoc.status = 'COMPLETED';
      reqDoc.reviewStars = stars || 5;
      reqDoc.reviewComment = comment || 'Delivered safely';
      reqDoc.timeline.push({
        stage: 'COMPLETED',
        title: 'Handover Verified & Reviewed',
        description: `Signed off with ${reqDoc.reviewStars}★ ("${reqDoc.reviewComment}")`,
        actor: actor || 'Volunteer Runner'
      });

      // Notify Everyone involved
      await notify('ADMIN', '🎉 Aid Delivery Closed Successfully', `Order #${reqDoc._id.toString().slice(-5)} (${reqDoc.itemName}) was handed over with ${reqDoc.reviewStars}★.`);
      await notify('DONOR', '🌟 Your Donation Reached the Receiver!', `The ${reqDoc.itemName} you funded was successfully delivered to ${reqDoc.recipientName}.`);
      await notify('RECEIVER', '📦 Delivery Completed & Closed', `Your aid package (${reqDoc.itemName}) has been marked delivered. Thank you!`, reqDoc.recipientName);
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
    console.log(`Notification Engine & Server READY on port ${PORT}`);
  });
}).catch(e => console.error("Database connection error:", e));