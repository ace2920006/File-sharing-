const fs = require('fs');
const cron = require('node-cron');
const File = require('../models/File');

/**
 * Sweeps the database for expired files or files exceeding download limits and removes them from disk & DB.
 */
const cleanupExpiredFiles = async () => {
  try {
    const now = new Date();
    
    // Find files that are expired OR have reached/exceeded their download limit
    const expiredOrLimitedFiles = await File.find({
      $or: [
        { expiresAt: { $ne: null, $lte: now } },
        { 
          $and: [
            { downloadLimit: { $ne: null, $gt: 0 } },
            { $expr: { $gte: ["$downloadCount", "$downloadLimit"] } }
          ]
        }
      ]
    });

    if (expiredOrLimitedFiles.length === 0) {
      return;
    }

    console.log(`[Cleanup Cron]: Found ${expiredOrLimitedFiles.length} expired/exceeded files to remove.`);

    for (const fileRecord of expiredOrLimitedFiles) {
      // Unlink encrypted file on disk if it exists
      if (fileRecord.encryptedPath && fs.existsSync(fileRecord.encryptedPath)) {
        try {
          await fs.promises.unlink(fileRecord.encryptedPath);
          console.log(`[Cleanup Cron]: Deleted file from disk: ${fileRecord.filename}`);
        } catch (err) {
          console.error(`[Cleanup Cron Error]: Failed to delete file ${fileRecord.filename} from disk:`, err.message);
        }
      }

      // Delete database record
      await File.findByIdAndDelete(fileRecord._id);
    }

    console.log(`[Cleanup Cron]: Cleanup complete.`);
  } catch (error) {
    console.error('[Cleanup Cron Error]:', error.message);
  }
};

/**
 * Initializes cron schedule (runs every 10 minutes).
 */
const initCleanupCron = () => {
  // Run once on startup
  cleanupExpiredFiles();

  // Run every 10 minutes
  cron.schedule('*/10 * * * *', () => {
    cleanupExpiredFiles();
  });
};

module.exports = {
  cleanupExpiredFiles,
  initCleanupCron
};
