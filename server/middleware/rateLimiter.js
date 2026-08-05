const rateLimit = require('express-rate-limit');

// Upload rate limiter: 100 uploads per 15 minutes per IP
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many upload requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Verify rate limiter: 30 attempts per 15 minutes
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many password verification attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  uploadLimiter,
  verifyLimiter
};
