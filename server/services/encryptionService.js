const crypto = require('crypto');
const fs = require('fs');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;

const getSecretKey = () => {
  const hexKey = process.env.ENCRYPTION_KEY || '4f8b92c10d3e5a7f6b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a';
  return Buffer.from(hexKey, 'hex');
};

/**
 * Encrypts a buffer or file path and writes the encrypted payload to destination path.
 * Payload format: [IV (12B)][AUTH_TAG (16B)][CIPHERTEXT]
 * @param {Buffer} buffer Raw file buffer
 * @param {string} destPath Target encrypted file path
 */
const encryptBufferToFile = async (buffer, destPath) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getSecretKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine IV + AuthTag + Encrypted Content
  const finalBuffer = Buffer.concat([iv, authTag, encryptedData]);
  await fs.promises.writeFile(destPath, finalBuffer);
};

/**
 * Reads an encrypted file payload and returns the decrypted Buffer.
 * @param {string} sourcePath Path to encrypted file
 * @returns {Promise<Buffer>} Decrypted Buffer
 */
const decryptFileToBuffer = async (sourcePath) => {
  const fileContent = await fs.promises.readFile(sourcePath);

  if (fileContent.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error('Invalid or corrupted encrypted file.');
  }

  const iv = fileContent.subarray(0, IV_LENGTH);
  const authTag = fileContent.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encryptedData = fileContent.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const key = getSecretKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decryptedBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  return decryptedBuffer;
};

module.exports = {
  encryptBufferToFile,
  decryptFileToBuffer
};
