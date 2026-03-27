const {
  generateSecret,
  generateQRCode,
  verifyToken,
  saveSecret,
  enable2FA,
  disable2FA,
  get2FAStatus
} = require('../services/twoFactor.service');
const { getUserById } = require('../services/twoFactor.service');
const user_db = require('../db/db');

async function setup2FAController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ message: 'Not authenticated' });
  }

  try {
    //Get user info
    const user = await new Promise((resolve, reject) => {
      user_db.get(
        `SELECT username, email FROM users WHERE id = ?`,
        [userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });

    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    const secret = generateSecret(user.username, user.email);
    await saveSecret(userId, secret);

    const qrCode = await generateQRCode(secret);
    const otpauthUrl = secret.otpauth_url;

    return reply.send({
      secret: secret.base32,
      qrCode: qrCode,
      // fix for broken API
      qrcode: qrCode,
      qr_code: qrCode,
      otpauthUrl: otpauthUrl,
      otpauth_url: otpauthUrl,
      manualEntryKey: secret.base32,
      manual_entry_key: secret.base32
    });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Failed to setup 2FA' });
  }
}

async function verifyAndEnable2FAController(request, reply) {
  const userId = request.session.userId;
  const { token } = request.body;

  if (!userId) {
    return reply.code(401).send({ message: 'Not authenticated' });
  }

  if (!token) {
    return reply.code(400).send({ message: 'Token is required' });
  }

  try {
    const status = await get2FAStatus(userId);

    if (!status || !status.two_factor_secret) {
      return reply.code(400).send({ message: '2FA not set up. Please setup first.' });
    }

    const isValid = verifyToken(status.two_factor_secret, token);

    if (!isValid) {
      return reply.code(400).send({ message: 'Invalid token' });
    }

    // Enable 2FA
    await enable2FA(userId);

    return reply.send({ message: '2FA enabled successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Failed to enable 2FA' });
  }
}

async function disable2FAController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ message: 'Not authenticated' });
  }

  try {
    await disable2FA(userId);
    return reply.send({ message: '2FA disabled successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Failed to disable 2FA' });
  }
}

async function get2FAStatusController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ message: 'Not authenticated' });
  }

  try {
    const status = await get2FAStatus(userId);
    return reply.send({
      enabled: status ? status.two_factor_enabled === 1 : false
    });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Failed to get 2FA status' });
  }
}

async function verify2FATokenController(request, reply) {
  const { token, userId } = request.body;

  if (!token || !userId) {
    return reply.code(400).send({ message: 'Token and userId are required' });
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    if (!user.two_factor_enabled || !user.two_factor_secret) {
      return reply.code(400).send({ message: '2FA not enabled for this user' });
    }

    const isValid = verifyToken(user.two_factor_secret, token);

    if (!isValid) {
      return reply.code(401).send({ message: 'Invalid token' });
    }

    return reply.send({ message: 'Token verified successfully', verified: true });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Failed to verify token' });
  }
}

module.exports = {
  setup2FAController,
  verifyAndEnable2FAController,
  disable2FAController,
  get2FAStatusController,
  verify2FATokenController
};
