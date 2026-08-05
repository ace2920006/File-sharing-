const multer = require('multer');
const path = require('path');

// Store upload in memory buffer so we can encrypt before writing to disk
const storage = multer.memoryStorage();

const blockedExtensions = ['.exe', '.bat', '.cmd', '.sh', '.vbs', '.msi', '.scr', '.jar', '.ps1', '.dll', '.so'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (blockedExtensions.includes(ext)) {
    return cb(new Error(`File type ${ext} is blocked for security reasons.`), false);
  }
  cb(null, true);
};

const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '100', 10);

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024 // Convert MB to bytes
  },
  fileFilter
});

module.exports = upload;
