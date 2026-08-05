require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initCleanupCron } = require('./services/cleanupService');

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Initialize periodic background file cleanup
initCleanupCron();

// Start Server
const server = app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`🚀 SecureShare Backend running on port ${PORT}`);
  console.log(`🔒 AES-256-GCM Encryption Enabled`);
  console.log(`===========================================`);
});

process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Promise Rejection]:', err);
});
