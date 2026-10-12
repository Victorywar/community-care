const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

// 1. Register endpoint (Donor, Volunteer, Recipient)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = (role || 'RECEIVER').toUpperCase();
    const isApproved = userRole === 'VOLUNTEER' ? false : true;

    const user = new User({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: userRole,
      phone: phone || '',
      address: address || '',
      isApproved
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'COMMUNITY_CARE_PRODUCTION_SECRET_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Login endpoint (Admin bypass + Regular user verification)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const cleanIdentifier = (email || '').trim().toLowerCase();
    const userRole = (role || 'ADMIN').toUpperCase();

    // Admin direct access (user: admin / pass: admin@1234)
    if (userRole === 'ADMIN' && (cleanIdentifier === 'admin' || cleanIdentifier === 'admin@communitycare.org')) {
      if (password !== 'admin@1234') {
        return res.status(400).json({ message: 'Incorrect admin password' });
      }

      let adminUser = await User.findOne({ role: 'ADMIN' });
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('admin@1234', 10);
        adminUser = await User.create({
          name: 'System Administrator',
          email: 'admin@communitycare.org',
          password: hashedPassword,
          role: 'ADMIN',
          isApproved: true
        });
      }

      const token = jwt.sign(
        { id: adminUser._id, role: 'ADMIN' },
        process.env.JWT_SECRET || 'COMMUNITY_CARE_PRODUCTION_SECRET_2026',
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: adminUser._id,
          name: 'Admin',
          email: 'admin@communitycare.org',
          role: 'ADMIN',
          isApproved: true,
          isAvailable: true
        }
      });
    }

    // Regular users (Donor, Volunteer, Recipient)
    const user = await User.findOne({ email: cleanIdentifier });
    if (!user) {
      return res.status(400).json({ message: 'Account not found. Please register first.' });
    }

    if (user.role !== userRole) {
      return res.status(400).json({ message: `Account exists as ${user.role}, not ${userRole}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'VOLUNTEER' && !user.isApproved) {
      return res.status(403).json({ message: 'Volunteer account pending Administrator approval.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'COMMUNITY_CARE_PRODUCTION_SECRET_2026',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        isAvailable: user.isAvailable
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Profile endpoint
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;