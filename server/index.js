const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' })); // Allow base64 photo uploads

// MongoDB Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: 'demo123' },
  role: { type: String, enum: ['ADMIN', 'RECIPIENT', 'RECEIVER', 'DONOR', 'VOLUNTEER'], default: 'RECIPIENT' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

const RequestSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  description: { type: String, default: '' },
  location: { type: String, required: true },
  recipientId: { type: String, default: '' },
  recipientName: { type: String, required: true },
  donorName: { type: String, default: '' },
  volunteerName: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['PENDING', 'VERIFIED', 'FUNDED', 'DISPATCHED', 'COMPLETED', 'CANCELLED'], 
    default: 'PENDING' 
  }
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, default: 'ALL' },
  role: { type: String, default: 'ALL' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  role: { type: String, default: 'USER' },
  text: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

// Routes: Auth & Profile
app.post('/api/auth/profile', async (req, res) => {
  try {
    const { email, name, phone, address, avatar } = req.body;
    let user = await User.findOneAndUpdate(
      { email },
      { name, phone, address, avatar },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/profile/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    res.json(user || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes: Requests
app.get('/api/requests', async (req, res) => {
  try {
    const list = await Request.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const newReq = await Request.create(req.body);
    // Notify Admins immediately
    await Notification.create({
      role: 'ADMIN',
      title: '🚨 Urgent Food/Relief Requested',
      message: `${newReq.recipientName} requested ${newReq.quantity}x ${newReq.itemName} at ${newReq.location}.`
    });
    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/requests/:id/status', async (req, res) => {
  try {
    const { status, donorName, volunteerName } = req.body;
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { $set: { status, ...(donorName && { donorName }), ...(volunteerName && { volunteerName }) } },
      { new: true }
    );

    if (status === 'VERIFIED') {
      await Notification.create({
        role: 'DONOR',
        title: '📦 New Verified Need Ready for Donation',
        message: `Admin verified ${updated.itemName} (${updated.quantity} units) for ${updated.location}.`
      });
    } else if (status === 'FUNDED') {
      await Notification.create({
        role: 'VOLUNTEER',
        title: '🚚 Dispatch Ready for Pickup',
        message: `${donorName || 'A donor'} funded ${updated.itemName}. Assigned to volunteers for transit.`
      });
    } else if (status === 'COMPLETED') {
      await Notification.create({
        role: 'RECEIVER',
        title: '✅ Relief Delivered',
        message: `Your requested ${updated.itemName} was delivered by ${volunteerName || 'our volunteer'}.`
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes: Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const role = req.query.role || 'ALL';
    const notifs = await Notification.find({
      $or: [{ role: 'ALL' }, { role: role.toUpperCase() }]
    }).sort({ createdAt: -1 }).limit(30);
    res.json(notifs);
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

// Routes: Relay Chat
app.get('/api/messages', async (req, res) => {
  try {
    const msgs = await Message.find().sort({ createdAt: 1 }).limit(50);
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_care';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`CommunityCare Backend Live on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB Connection Failed:", err));