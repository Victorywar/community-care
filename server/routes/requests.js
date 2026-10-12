const express = require('express');
const router = express.Router();
const HelpRequest = require('../models/HelpRequest');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, async (req, res) => {
  try {
    let filter = {};
    if (req.user && (req.user.role === 'RECIPIENT' || req.user.role === 'RECEIVER')) {
      filter = { recipientEmail: req.user.email };
    }
    const requests = await HelpRequest.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('GET /api/requests error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      category,
      itemName,
      quantityNeeded,
      unit,
      urgency,
      description,
      deliveryAddress,
      contactNumber,
      orgName
    } = req.body;

    const reqId = 'CC-' + Math.floor(1000 + Math.random() * 9000);

    const newReq = new HelpRequest({
      requestId: reqId,
      recipientName: orgName || (req.user?.name || 'Community Recipient'),
      recipientEmail: req.user?.email || 'recipient@communitycare.org',
      contactNumber: contactNumber || '+91 98765 43210',
      category: category || 'Food',
      itemName: itemName ? itemName.trim() : 'Relief Aid',
      quantityNeeded: Number(quantityNeeded) || 1,
      unit: unit || 'Packs',
      urgency: urgency ? urgency.toString().toUpperCase() : 'NORMAL',
      description: description || '',
      deliveryAddress: deliveryAddress || 'Shelter Ward, Sector 4',
      status: 'PENDING',
      assignedVolunteer: 'Under Review'
    });

    const saved = await newReq.save();
    console.log('✓ Created HelpRequest:', saved.requestId);
    return res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/requests error:', err);
    return res.status(400).json({ message: err.message });
  }
});

router.patch('/:id/confirm', requireAuth, async (req, res) => {
  try {
    const request = await HelpRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'DELIVERED',
        receivedAt: new Date(),
        recipientRemarks: req.body.remarks || 'Confirmed received by recipient'
      },
      { new: true }
    );
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    console.error('PATCH confirm error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;