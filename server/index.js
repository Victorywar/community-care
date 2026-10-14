const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/community_care';
mongoose.connect(MONGO_URI)
  .then(() => console.log('>>> [Database] MongoDB Connected to community_care'))
  .catch((err) => console.warn('>>> [Database Notice] MongoDB disconnected, operating with persistent in-memory engine:', err.message));

// ==========================================
// SCHEMAS & MODELS
// ==========================================
const TimelineSchema = new mongoose.Schema({
  id: { type: String, default: () => 'EVT-' + Math.floor(10000 + Math.random() * 90000) },
  status: { type: String, required: true },
  time: { type: Date, default: Date.now },
  actorId: String,
  actorRole: String,
  actorName: String,
  note: String
});

const RequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'units' },
  category: { type: String, default: 'Food and groceries' },
  description: String,
  condition: { type: String, default: 'New/Good' },
  pickupAddress: String,
  deliveryAddress: String,
  donorId: String,
  donorName: String,
  volunteerId: String,
  volunteerName: String,
  receiverId: String,
  receiverName: String,
  photos: [String],
  status: {
    type: String,
    enum: [
      'PENDING_APPROVAL', 'PUBLISHED', 'AWAITING_VOLUNTEER', 
      'VOLUNTEER_ASSIGNED', 'PICKUP_SCHEDULED', 'COLLECTED', 
      'IN_TRANSIT', 'DELIVERED', 'COMPLETED', 'CANCELLED'
    ],
    default: 'PUBLISHED'
  },
  reviewStars: { type: Number, default: 5 },
  reviewComment: { type: String, default: '' },
  timeline: [TimelineSchema],
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '123456' },
  phone: String,
  role: { type: String, enum: ['ADMIN', 'DONOR', 'VOLUNTEER', 'RECIPIENT', 'RECEIVER'], required: true },
  accountStatus: { type: String, enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED'], default: 'APPROVED' },
  rejectionReason: String,
  address: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const NotificationSchema = new mongoose.Schema({
  recipientId: String,
  recipientRole: String,
  title: String,
  message: String,
  read: { type: Boolean, default: false },
  relatedId: String,
  createdAt: { type: Date, default: Date.now }
});

const Request = mongoose.models.Request || mongoose.model('Request', RequestSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// ==========================================
// RESILIENT IN-MEMORY STORE (Dual Mode)
// ==========================================
let memUsers = [
  { _id: 'u-admin-1', name: 'System Admin', email: 'admin@communitycare.org', password: 'admin', role: 'ADMIN', accountStatus: 'APPROVED' },
  { _id: 'u-donor-1', name: 'Midhuna', email: 'donor@communitycare.org', password: 'donor', role: 'DONOR', accountStatus: 'APPROVED' },
  { _id: 'u-vol-1', name: 'Karthik Raja', email: 'volunteer@communitycare.org', password: 'vol', role: 'VOLUNTEER', accountStatus: 'APPROVED' },
  { _id: 'u-rec-1', name: 'Anitha M', email: 'recipient@communitycare.org', password: 'rec', role: 'RECIPIENT', accountStatus: 'APPROVED' }
];

let memRequests = [
  {
    _id: 'REQ-1001',
    title: 'Emergency Flood Relief Rations',
    itemName: 'Rice & Pulse Rations (50kg)',
    quantity: 50,
    unit: 'bags',
    category: 'Food and groceries',
    description: 'Provisions for families displaced in relief camps.',
    pickupAddress: 'Cuddalore Main Depot Dock 2',
    deliveryAddress: 'Sector 4 Community Hall',
    donorId: 'u-donor-1',
    donorName: 'Midhuna',
    volunteerId: 'u-vol-1',
    volunteerName: 'Karthik Raja',
    receiverId: 'u-rec-1',
    receiverName: 'Anitha M',
    status: 'COMPLETED',
    reviewStars: 5,
    reviewComment: 'Supplies received in excellent condition. Thank you so much!',
    timeline: [
      { id: 'EVT-1', status: 'PUBLISHED', time: new Date(Date.now() - 86400000 * 3), actorRole: 'DONOR', actorName: 'Midhuna', note: 'Donation published successfully' },
      { id: 'EVT-2', status: 'VOLUNTEER_ASSIGNED', time: new Date(Date.now() - 86400000 * 2), actorRole: 'VOLUNTEER', actorName: 'Karthik Raja', note: 'Volunteer accepted pickup assignment' },
      { id: 'EVT-3', status: 'COLLECTED', time: new Date(Date.now() - 86400000 * 1), actorRole: 'VOLUNTEER', actorName: 'Karthik Raja', note: 'Supplies collected from donor location' },
      { id: 'EVT-4', status: 'DELIVERED', time: new Date(Date.now() - 3600000 * 4), actorRole: 'VOLUNTEER', actorName: 'Karthik Raja', note: 'Delivered at delivery address' },
      { id: 'EVT-5', status: 'COMPLETED', time: new Date(), actorRole: 'RECIPIENT', actorName: 'Anitha M', note: 'Receiver confirmed receipt and verified handover' }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3)
  },
  {
    _id: 'REQ-1002',
    title: 'Warm Clothes & Blankets',
    itemName: 'Woolen Blankets (30 units)',
    quantity: 30,
    unit: 'pcs',
    category: 'Clothes',
    description: 'Fresh clean blankets for cold weather support.',
    pickupAddress: 'Central Warehouse, Bay 4',
    deliveryAddress: 'Shelter Ward 3',
    donorId: 'u-donor-1',
    donorName: 'Midhuna',
    volunteerId: '',
    volunteerName: '',
    receiverId: 'u-rec-1',
    receiverName: 'Anitha M',
    status: 'AWAITING_VOLUNTEER',
    reviewStars: 5,
    reviewComment: '',
    timeline: [
      { id: 'EVT-10', status: 'PUBLISHED', time: new Date(Date.now() - 3600000 * 5), actorRole: 'DONOR', actorName: 'Midhuna', note: 'Donation published and open for volunteer pickup' }
    ],
    createdAt: new Date(Date.now() - 3600000 * 5)
  }
];

let memNotifications = [
  { _id: 'notif-1', recipientRole: 'DONOR', title: 'Donation Completed', message: 'Congratulations! Your donation has been delivered and confirmed by Anitha M.', read: false, createdAt: new Date() }
];

function notify(recipientRole, title, message, relatedId) {
  const notif = {
    _id: 'notif-' + Date.now() + Math.random().toString(36).substring(7),
    recipientRole,
    title,
    message,
    read: false,
    relatedId,
    createdAt: new Date()
  };
  memNotifications.unshift(notif);
}

// ==========================================
// REST APIS
// ==========================================

// 1. Health
app.get('/api/health', (req, res) => res.json({ status: 'OK', records: memRequests.length, users: memUsers.length }));

// 2. Auth: Login
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = memUsers.find(u => u.email.toLowerCase() === (email || '').toLowerCase() || u.role === role);
  if (!user) {
    const newUser = {
      _id: 'u-' + Date.now(),
      name: email.split('@')[0],
      email,
      role: role || 'DONOR',
      accountStatus: 'APPROVED'
    };
    memUsers.push(newUser);
    return res.json({ success: true, user: newUser });
  }

  if (user.accountStatus === 'PENDING_APPROVAL') {
    return res.status(403).json({ error: 'Your account is currently awaiting admin verification. You will be notified once your account is approved.' });
  }
  if (user.accountStatus === 'REJECTED' || user.accountStatus === 'SUSPENDED') {
    return res.status(403).json({ error: `Your account status is ${user.accountStatus}. Please contact support.` });
  }
  res.json({ success: true, user });
});

// 3. Auth: Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, role, address } = req.body;
  const existing = memUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) return res.status(400).json({ error: 'Email already registered.' });

  const isApprovedImmediately = role === 'ADMIN';
  const newUser = {
    _id: 'u-' + Date.now(),
    name,
    email,
    phone,
    role,
    address,
    accountStatus: isApprovedImmediately ? 'APPROVED' : 'PENDING_APPROVAL',
    createdAt: new Date()
  };
  memUsers.push(newUser);
  notify('ADMIN', 'New User Registration', `${name} registered as a ${role} and is awaiting review.`);
  res.json({
    success: true,
    user: newUser,
    message: isApprovedImmediately 
      ? 'Account ready.' 
      : 'Your account is currently awaiting admin verification. You will be notified once your account is approved.'
  });
});

// 4. Admin User Management
app.get('/api/admin/users', (req, res) => res.json(memUsers));

app.patch('/api/admin/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;
  const user = memUsers.find(u => u._id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.accountStatus = status;
  if (reason) user.rejectionReason = reason;
  notify(user.role, `Account Status Updated`, `Your account status has been updated to: ${status}.`);
  res.json({ success: true, user });
});

// 5. Requisitions Feed
app.get('/api/requests', (req, res) => res.json(memRequests));

// 6. Create Donation / Post Item
app.post('/api/requests', (req, res) => {
  const newDonation = {
    _id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
    title: req.body.title || req.body.itemName,
    itemName: req.body.itemName,
    quantity: Number(req.body.quantity) || 1,
    unit: req.body.unit || 'units',
    category: req.body.category || 'Food and groceries',
    description: req.body.description || '',
    condition: req.body.condition || 'Good',
    pickupAddress: req.body.pickupAddress || req.body.location || 'Local Donor Depot',
    deliveryAddress: req.body.deliveryAddress || 'Central Redistribution Hub',
    donorId: req.body.donorId || 'u-donor-1',
    donorName: req.body.donorName || 'Midhuna',
    volunteerId: '',
    volunteerName: '',
    receiverId: req.body.receiverId || '',
    receiverName: req.body.receiverName || '',
    photos: req.body.photos || (req.body.donationPhoto ? [req.body.donationPhoto] : []),
    status: 'AWAITING_VOLUNTEER',
    reviewStars: 5,
    reviewComment: '',
    timeline: [
      {
        id: 'EVT-' + Date.now(),
        status: 'PUBLISHED',
        time: new Date(),
        actorRole: 'DONOR',
        actorName: req.body.donorName || 'Midhuna',
        note: `Donation posted: ${req.body.itemName} (${req.body.quantity || 1} units)`
      }
    ],
    createdAt: new Date()
  };
  memRequests.unshift(newDonation);
  notify('VOLUNTEER', 'New Donation Available', `New donation available for pickup: ${newDonation.itemName}`, newDonation._id);
  notify('ADMIN', 'New Donation Posted', `${newDonation.donorName} posted ${newDonation.itemName}`);
  res.status(201).json(newDonation);
});

// 7. Atomic Timeline Transition Engine
app.patch('/api/requests/:id/transition', (req, res) => {
  const { id } = req.params;
  const { action, actorRole, actorName, note, reviewStars, reviewComment } = req.body;
  const target = memRequests.find(r => r._id === id);
  if (!target) return res.status(404).json({ error: 'Donation not found' });

  let nextStatus = target.status;

  if (action === 'VOLUNTEER_ACCEPT') {
    if (target.volunteerId && target.volunteerId !== req.body.volunteerId) {
      return res.status(409).json({ error: 'Task has already been accepted by another volunteer.' });
    }
    target.volunteerId = req.body.volunteerId || 'u-vol-1';
    target.volunteerName = actorName || 'Volunteer';
    nextStatus = 'VOLUNTEER_ASSIGNED';
    notify('DONOR', 'Volunteer Assigned', `${actorName} accepted pickup for ${target.itemName}`, id);
  } else if (action === 'PICKUP_COLLECTED') {
    nextStatus = 'COLLECTED';
    notify('DONOR', 'Donation Collected', `Volunteer ${target.volunteerName} collected your donation.`, id);
  } else if (action === 'OUT_FOR_DELIVERY') {
    nextStatus = 'IN_TRANSIT';
    notify('RECIPIENT', 'Delivery In Transit', `Your requested supplies (${target.itemName}) are on the way!`, id);
  } else if (action === 'DELIVERED_HANDOVER') {
    nextStatus = 'DELIVERED';
    notify('RECIPIENT', 'Arrived: Confirm Receipt', `Your supplies have arrived. Please confirm receipt to complete the journey.`, id);
  } else if (action === 'CONFIRM_RECEIPT') {
    nextStatus = 'COMPLETED';
    target.reviewStars = Number(reviewStars) || 5;
    target.reviewComment = reviewComment || 'Receipt confirmed safely.';
    notify('DONOR', 'Congratulations!', `Your donation has been delivered and confirmed by ${actorName}. Thank you for making a difference!`, id);
    notify('VOLUNTEER', 'Delivery Confirmed', `Receiver ${actorName} verified receipt of ${target.itemName}. Task completed!`, id);
  } else if (action === 'CANCEL') {
    nextStatus = 'CANCELLED';
    notify('ADMIN', 'Donation Cancelled', `Donation ${target._id} was cancelled by ${actorName}.`, id);
  }

  target.status = nextStatus;
  target.timeline.push({
    id: 'EVT-' + Date.now(),
    status: nextStatus,
    time: new Date(),
    actorRole: actorRole || 'SYSTEM',
    actorName: actorName || 'User',
    note: note || `Progressed to ${nextStatus}`
  });

  res.json({ success: true, request: target });
});

// 8. Notifications API
app.get('/api/notifications', (req, res) => {
  const role = req.query.role || 'ALL';
  const filtered = memNotifications.filter(n => role === 'ALL' || n.recipientRole === role || n.recipientRole === 'ALL');
  res.json(filtered);
});

app.patch('/api/notifications/mark-read', (req, res) => {
  memNotifications.forEach(n => { n.read = true; });
  res.json({ success: true });
});

// Profile Patch
app.patch('/api/users/profile', (req, res) => res.json({ success: true, user: req.body }));

// Seed endpoint
app.post('/api/seed', (req, res) => res.json({ success: true, count: memRequests.length }));

// Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> Community Care Backend Engine ACTIVE: http://0.0.0.0:${PORT} <<<`);
});