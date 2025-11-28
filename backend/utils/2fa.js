const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const path = require('path');
const user_db = require(path.join(__dirname, '../db'));

/**
 * Generate 2FA secret for a user
 * @param {string} username - Username
 * @param {string} email - User email
 * @returns {Object} Secret object with secret, otpauth_url, and QR code data URL
 */
async function generate2FASecret(username, email) {
  const secret = speakeasy.generateSecret({
    name: `Pong (${username})`,
    issuer: 'Pong Game'
  });

  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
    qr_code: qrCodeDataURL
  };
}

/**
 * Verify 2FA token
 * @param {string} token - 6-digit code from authenticator
 * @param {string} secret - User's 2FA secret
 * @returns {boolean} True if token is valid
 */
function verify2FAToken(token, secret) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time steps (60 seconds) of tolerance
  });
}

/**
 * Save 2FA secret to database
 * @param {number} userId - User ID
 * @param {string} secret - 2FA secret
 * @returns {Promise}
 */
function save2FASecret(userId, secret) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET two_factor_secret = ? WHERE id = ?`,
      [secret, userId],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

/**
 * Enable 2FA for a user
 * @param {number} userId - User ID
 * @returns {Promise}
 */
function enable2FA(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET two_factor_enabled = 1 WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

/**
 * Disable 2FA for a user
 * @param {number} userId - User ID
 * @returns {Promise}
 */
function disable2FA(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET two_factor_enabled = 0, two_factor_secret = NULL WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

/**
 * Get user's 2FA secret
 * @param {number} userId - User ID
 * @returns {Promise<string|null>} Secret or null
 */
function getUser2FASecret(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT two_factor_secret FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.two_factor_secret : null);
      }
    );
  });
}

/**
 * Check if user has 2FA enabled
 * @param {number} userId - User ID
 * @returns {Promise<boolean>}
 */
function is2FAEnabled(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT two_factor_enabled FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row ? row.two_factor_enabled === 1 : false);
      }
    );
  });
}

module.exports = {
  generate2FASecret,
  verify2FAToken,
  save2FASecret,
  enable2FA,
  disable2FA,
  getUser2FASecret,
  is2FAEnabled
};

