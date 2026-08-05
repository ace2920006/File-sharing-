const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP blocking in dev for flexible assets
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Enable CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length']
  })
);

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'SecureShare API'
  });
});

// API Routes
app.use('/api/files', fileRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Endpoint Not Found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Express Error]:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
