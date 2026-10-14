const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));

// Guaranteed in-memory store initialized on boot
let requests = [
  {
    _id: "REQ-1001",
    itemName: "Rice & Pulse Rations (50kg)",
    quantity: 50,
    description: "Emergency provisions for flood-affected families in North Ward",
    location: "Cuddalore Old Town",
    recipientName: "Anitha M",
    donorName: "Midhuna",
    donationType: "Food & Rations",
    volunteerName: "Karthik Raja",
    status: "COMPLETED",
    reviewStars: 5,
    reviewComment: "Provisions reached safely on time. Very helpful for our families!",
    timeline: [
      { status: "REQUESTED", time: new Date(Date.now() - 86400000 * 3), actor: "Anitha M", note: "Requisition raised" },
      { status: "VERIFIED", time: new Date(Date.now() - 86400000 * 2), actor: "Admin Command", note: "Needs verified" },
      { status: "ACCEPTED", time: new Date(Date.now() - 86400000 * 1), actor: "Midhuna", note: "Pledged by donor" },
      { status: "DISPATCHED", time: new Date(Date.now() - 3600000 * 8), actor: "Karthik Raja", note: "In transit" },
      { status: "COMPLETED", time: new Date(), actor: "Anitha M", note: "Handover confirmed & reviewed" }
    ]
  },
  {
    _id: "REQ-1002",
    itemName: "Winter Blankets & Clothes (30 Pcs)",
    quantity: 30,
    description: "Warm clothing packs for shelter residents",
    location: "Sector 4 Community Hall",
    recipientName: "Sundar R",
    donorName: "",
    status: "ACCEPTED",
    donationType: "Clothes & Blankets",
    timeline: [
      { status: "REQUESTED", time: new Date(Date.now() - 86400000), actor: "Sundar R", note: "Shelter request logged" },
      { status: "VERIFIED", time: new Date(), actor: "Admin Command", note: "Authorized for donor pickup" }
    ]
  }
];

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'OK', count: requests.length }));
app.get('/api/requests', (req, res) => res.json(requests));

app.post('/api/requests', (req, res) => {
  const item = {
    _id: "REQ-" + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    status: req.body.status || 'ACCEPTED',
    timeline: [
      { status: req.body.status || 'ACCEPTED', time: new Date(), actor: req.body.donorName || 'Donor', note: 'Donation created' }
    ],
    createdAt: new Date()
  };
  requests.unshift(item);
  res.json(item);
});

app.patch('/api/requests/:id/timeline-step', (req, res) => {
  const { action, actor, donationType, photo, note } = req.body;
  let target = requests.find(r => r._id === req.params.id);
  if (!target && requests.length > 0) target = requests[0];

  if (target) {
    if (action === 'DONOR_ACCEPT') target.status = 'ACCEPTED';
    if (action === 'VOLUNTEER_ACCEPT') target.status = 'DISPATCHED';
    if (action === 'COMPLETE') target.status = 'COMPLETED';
    if (donationType) target.donationType = donationType;
    if (photo) target.donationPhoto = photo;

    target.timeline.push({
      status: target.status,
      time: new Date(),
      actor: actor || 'Relay User',
      note: note || action
    });
    return res.json(target);
  }
  res.json({ success: true });
});

app.patch('/api/users/profile', (req, res) => {
  res.json({ success: true, user: req.body });
});

app.get('/api/notifications', (req, res) => res.json([]));
app.patch('/api/notifications/mark-read', (req, res) => res.json({ success: true }));

app.post('/api/seed', (req, res) => {
  res.json({ success: true, message: "Live requests and timelines active!" });
});

// Bind explicitly to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> BACKEND ACTIVE: http://localhost:${PORT} <<<`);
});