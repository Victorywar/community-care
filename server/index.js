require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/community_care';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB (community_care)'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/chat', require('./routes/chat'));

app.get('/', (req, res) => {
  res.json({ message: 'CommunityCare API running smoothly' });
});

app.listen(PORT, () => {
  console.log(`CommunityCare API running on http://localhost:${PORT}`);
});
