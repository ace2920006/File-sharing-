const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const File = require('../models/File');
const generateToken = require('../utils/generateToken');
const { encryptBufferToFile, decryptFileToBuffer } = require('../services/encryptionService');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Handle file upload
 * POST /api/files/upload
 */
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { password, expirationHours, downloadLimit } = req.body;

    const token = generateToken(12); // Cryptographically secure 24-char hex string
    const filename = `${token}_${Date.now()}`;
    const encryptedPath = path.join(UPLOADS_DIR, `${filename}.enc`);

    // 1. Encrypt buffer to disk
    await encryptBufferToFile(req.file.buffer, encryptedPath);

    // 2. Hash password if provided
    let hashedPassword = null;
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password.trim(), salt);
    }

    // 3. Calculate expiration date if provided
    let expiresAt = null;
    if (expirationHours && !isNaN(parseInt(expirationHours, 10))) {
      const hours = parseInt(expirationHours, 10);
      if (hours > 0) {
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      }
    }

    // 4. Calculate download limit
    let limit = null;
    if (downloadLimit && !isNaN(parseInt(downloadLimit, 10))) {
      const parsedLimit = parseInt(downloadLimit, 10);
      if (parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    // 5. Create Database record
    const fileDoc = new File({
      filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      token,
      encryptedPath,
      password: hashedPassword,
      expiresAt,
      downloadLimit: limit,
      downloadCount: 0
    });

    await fileDoc.save();

    return res.status(201).json({
      success: true,
      message: 'File uploaded and encrypted successfully.',
      token,
      url: `/download/${token}`,
      expiresAt: fileDoc.expiresAt,
      downloadLimit: fileDoc.downloadLimit,
      size: fileDoc.size,
      originalName: fileDoc.originalName
    });

  } catch (error) {
    console.error('[Upload Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'File upload failed.' });
  }
};

/**
 * Get public metadata for a file
 * GET /api/files/info/:token
 */
const getFileInfo = async (req, res) => {
  try {
    const { token } = req.params;
    const file = await File.findOne({ token });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found or link has expired.' });
    }

    const now = new Date();
    // Check if expired
    if (file.expiresAt && file.expiresAt <= now) {
      // Async delete expired file
      deleteFileRecord(file);
      return res.status(410).json({ success: false, message: 'This file link has expired.' });
    }

    // Check if download limit reached
    if (file.downloadLimit && file.downloadLimit > 0 && file.downloadCount >= file.downloadLimit) {
      deleteFileRecord(file);
      return res.status(410).json({ success: false, message: 'Download limit has been reached for this file.' });
    }

    const remainingDownloads = file.downloadLimit ? Math.max(0, file.downloadLimit - file.downloadCount) : null;

    return res.json({
      success: true,
      token: file.token,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      isPasswordProtected: Boolean(file.password),
      expiresAt: file.expiresAt,
      downloadLimit: file.downloadLimit,
      downloadCount: file.downloadCount,
      remainingDownloads,
      createdAt: file.createdAt
    });

  } catch (error) {
    console.error('[GetInfo Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving file info.' });
  }
};

/**
 * Verify password for protected file
 * POST /api/files/verify
 */
const verifyPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required.' });
    }

    const file = await File.findOne({ token });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    if (!file.password) {
      return res.json({ success: true, verified: true, message: 'File is not password protected.' });
    }

    const match = await bcrypt.compare(password, file.password);
    if (!match) {
      return res.status(401).json({ success: false, verified: false, message: 'Incorrect password.' });
    }

    return res.json({ success: true, verified: true, message: 'Password verified.' });

  } catch (error) {
    console.error('[VerifyPassword Error]:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying password.' });
  }
};

/**
 * Decrypt & download file
 * GET /api/files/:token
 */
const downloadFile = async (req, res) => {
  try {
    const { token } = req.params;
    const providedPassword = req.headers['x-file-password'] || req.query.password;

    const file = await File.findOne({ token });
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found or expired.' });
    }

    const now = new Date();
    if (file.expiresAt && file.expiresAt <= now) {
      deleteFileRecord(file);
      return res.status(410).json({ success: false, message: 'This file link has expired.' });
    }

    if (file.downloadLimit && file.downloadLimit > 0 && file.downloadCount >= file.downloadLimit) {
      deleteFileRecord(file);
      return res.status(410).json({ success: false, message: 'Download limit reached for this file.' });
    }

    // Verify password if protected
    if (file.password) {
      if (!providedPassword) {
        return res.status(401).json({ success: false, message: 'Password required to download this file.' });
      }
      const isMatch = await bcrypt.compare(providedPassword, file.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password.' });
      }
    }

    // Decrypt file from disk
    if (!fs.existsSync(file.encryptedPath)) {
      return res.status(404).json({ success: false, message: 'Physical file not found on server.' });
    }

    const decryptedBuffer = await decryptFileToBuffer(file.encryptedPath);

    // Update download count
    file.downloadCount += 1;
    await file.save();

    // Set headers
    const encodedFilename = encodeURIComponent(file.originalName);
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`);
    res.setHeader('Content-Length', decryptedBuffer.length);

    // Send decrypted buffer
    res.send(decryptedBuffer);

    // If download limit reached after this download, clean up file
    if (file.downloadLimit && file.downloadLimit > 0 && file.downloadCount >= file.downloadLimit) {
      setTimeout(() => {
        deleteFileRecord(file);
      }, 5000);
    }

  } catch (error) {
    console.error('[Download Error]:', error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Failed to decrypt and stream file.' });
    }
  }
};

/**
 * Internal helper to delete file from disk & DB
 */
const deleteFileRecord = async (fileDoc) => {
  try {
    if (fileDoc.encryptedPath && fs.existsSync(fileDoc.encryptedPath)) {
      await fs.promises.unlink(fileDoc.encryptedPath);
    }
    await File.findByIdAndDelete(fileDoc._id);
  } catch (e) {
    console.error('[DeleteFileRecord Error]:', e.message);
  }
};

module.exports = {
  uploadFile,
  getFileInfo,
  verifyPassword,
  downloadFile
};
