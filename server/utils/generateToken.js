const crypto = require('crypto');

/**
 * Generates a URL-safe cryptographically secure random token string.
 * @param {number} length Length of byte buffer (default 16 -> 32 hex chars)
 * @returns {string} Token string
 */
const generateToken = (length = 16) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = generateToken;
