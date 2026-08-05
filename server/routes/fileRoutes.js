const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadLimiter, verifyLimiter } = require('../middleware/rateLimiter');
const {
  uploadFile,
  getFileInfo,
  verifyPassword,
  downloadFile
} = require('../controllers/fileController');

// Upload file
router.post('/upload', uploadLimiter, upload.single('file'), uploadFile);

// Get public file metadata
router.get('/info/:token', getFileInfo);

// Verify password for protected file
router.post('/verify', verifyLimiter, verifyPassword);

// Download decrypted file
router.get('/:token', downloadFile);

module.exports = router;
