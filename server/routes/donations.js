const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const { requireAuth } = require('../middleware/auth');

// 1. Get donations based on role
router.get('/', requireAuth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'DONOR') {
      filter = { donorEmail: req.user.email };
    }
    const donations = await Donation.find(filter).sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Create Donation (Donor)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { category, itemName, totalQuantity, unit, qualityGrade, estimatedValue, photoUrl, pickupAddress, deliveryAddress } = req.body;
    const newDonation = new Donation({
      donorName: req.user.name || 'Anonymous Donor',
      donorEmail: req.user.email,
      category: category || 'RATION_KIT',
      itemName: itemName || 'Relief Goods',
      totalQuantity: Number(totalQuantity) || 1,
      unit: unit || 'Units',
      qualityGrade: qualityGrade || 'NEW_SEALED',
      estimatedValue: Number(estimatedValue) || 0,
      photoUrl: photoUrl || '',
      pickupAddress: pickupAddress || 'City Main Hub, Gate 2',
      deliveryAddress: deliveryAddress || 'Relief Camp Ward 3',
      status: 'LOGGED'
    });
    await newDonation.save();
    res.status(201).json(newDonation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Volunteer Status and Proof Updates
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status, deliveryProofUrl, recipientConfirmation } = req.body;
    const updateData = { updatedAt: new Date() };

    if (status) updateData.status = status;
    if (status === 'ASSIGNED') {
      updateData.assignedVolunteer = req.user.name || 'Field Volunteer';
      updateData.assignedVolunteerEmail = req.user.email;
    }
    if (deliveryProofUrl) updateData.deliveryProofUrl = deliveryProofUrl;
    if (recipientConfirmation) updateData.recipientConfirmation = recipientConfirmation;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
