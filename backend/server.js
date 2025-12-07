const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.match(/^http:\/\/localhost:\d+$/)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const rfpRoutes = require('./routes/rfp');
const vendorRoutes = require('./routes/vendor');
const proposalRoutes = require('./routes/proposal');
const emailRoutes = require('./routes/email');
const aiRoutes = require('./routes/ai');
const dashboardRoutes = require('./routes/dashboard');
const analyticsRoutes = require('./routes/analytics');

app.use('/api/rfps', rfpRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.2-regex-fix', message: 'RFP Management API is running' });
});

const { connectDB } = require('./db/connection');

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Backend initialization complete.');
});

