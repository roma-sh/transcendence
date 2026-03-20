const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

function generateSecret(username, email) {
  const secret = speakeasy.generateSecret({
    name: `Pong (${username})`,
    issuer: 'ft_transcendence',
    length: 32
  });
  return secret;
}

async function generateQRCode(secret) {
  try {
    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  } catch (err) {
    throw new Error('Failed to generate QR code: ' + err.message);
  }
}

function verifyToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
}

async function saveSecret(userId, secret) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET two_factor_secret = ? WHERE id = ?`,
      [secret.base32, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

async function enable2FA(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET two_factor_enabled = 1 WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

async function disable2FA(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET two_factor_enabled = 0, two_factor_secret = NULL WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

async function get2FAStatus(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT two_factor_enabled, two_factor_secret FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT * FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

module.exports = {
  generateSecret,
  generateQRCode,
  verifyToken,
  saveSecret,
  enable2FA,
  disable2FA,
  get2FAStatus,
  getUserById
};
