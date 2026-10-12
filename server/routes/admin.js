const express = require('express');
const router = express.Router();
const User = require('../models/User');
const HelpRequest = require('../models/HelpRequest');
const Donation = require('../models/Donation');
const { requireAuth, requireRole } = require('../middleware/auth');

// 1. Live Admin Notifications
router.get('/notifications', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const notifications = [];

    // Pending Volunteers
    const pendingVolunteers = await User.find({ role: 'VOLUNTEER', isApproved: false }).sort({ createdAt: -1 });
    pendingVolunteers.forEach(v => {
      notifications.push({
        id: `vol-${v._id}`,
        type: 'VOLUNTEER_PENDING',
        title: 'Volunteer Approval Needed',
        message: `${v.name} registered as a field volunteer and requires approval.`,
        time: v.createdAt || new Date(),
        unread: true
      });
    });

    // Recent Requests from HelpRequest model
    const recentRequests = await HelpRequest.find().sort({ createdAt: -1 }).limit(5);
    recentRequests.forEach(r => {
      notifications.push({
        id: `req-${r._id}`,
        type: 'AID_REQUEST',
        title: 'New Aid Request Registered',
        message: `${r.recipientName || 'Recipient'} requested ${r.quantityNeeded || ''} ${r.unit || ''} of ${r.itemName || 'relief aid'}.`,
        time: r.createdAt || new Date(),
        unread: r.status === 'PENDING'
      });
    });

    // Recent Donations
    const recentDonations = await Donation.find().sort({ createdAt: -1 }).limit(5);
    recentDonations.forEach(d => {
      notifications.push({
        id: `don-${d._id}`,
        type: 'DONATION',
        title: 'New Contribution Logged',
        message: `${d.donorName || 'Donor'} contributed ${d.totalQuantity || ''} ${d.unit || ''} (${d.category || 'Aid'}).`,
        time: d.createdAt || new Date(),
        unread: false
      });
    });

    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(notifications);
  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Members List
router.get('/members', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const members = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Update Member Status
router.patch('/members/:id/status', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const { isApproved } = req.body;
    const member = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: Boolean(isApproved) },
      { new: true }
    ).select('-password');

    if (!member) return res.status(404).json({ message: 'User not found' });
    res.json({ message: isApproved ? 'User approved successfully' : 'User rejected', member });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
