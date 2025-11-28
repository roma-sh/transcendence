const path = require('path');
const bcrypt = require('bcryptjs');
const user_db = require(path.join(__dirname, '../db'));
const { generate2FASecret, verify2FAToken, save2FASecret, enable2FA, getUser2FASecret, is2FAEnabled, disable2FA } = require('../utils/2fa');
const { verifyToken, extractTokenFromHeader, generateToken } = require('../utils/jwt');

/**
 * Insert a new user into the database (with hashed password)
 */
function insertUser(username, email, password) {
  return new Promise((resolve, reject) => {
    // Hash password before storing
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);
      
      user_db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, hashedPassword],
        function (err) {
          if (err) return reject(err);
          resolve(this.lastID);
        }
      );
    });
  });
}

/**
 * Get user from the database by username
 */
function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

/**
 * Verify password against hashed password
 */
function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Register authentication routes
 */
async function authRoutes(fastify) {
  // Signup
  fastify.post('/signup', async (request, reply) => {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return reply.code(400).send({ error: 'All fields are required' });
    }

    try {
      const userId = await insertUser(username, email, password);
      return reply.send({ success: true, userId });
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return reply.code(409).send({ error: 'Email already exists' });
      }
      return reply.code(500).send({ error: 'Server error', details: err.message });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { username, password, twoFactorCode } = request.body;

    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password are required' });
    }

    try {
      // Get user by username
      const user = await getUserByUsername(username);
      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      // Check if 2FA is enabled
      const has2FA = await is2FAEnabled(user.id);

      if (has2FA) {
        // 2FA is enabled - require code
        if (!twoFactorCode) {
          return reply.code(200).send({ 
            requires2FA: true,
            message: '2FA code required' 
          });
        }

        // Verify 2FA code
        const secret = await getUser2FASecret(user.id);
        if (!secret) {
          return reply.code(500).send({ error: '2FA secret not found' });
        }

        const isValid2FA = verify2FAToken(twoFactorCode, secret);
        if (!isValid2FA) {
          return reply.code(401).send({ error: 'Invalid 2FA code' });
        }
      }

      // Password verified (and 2FA if enabled) - generate JWT
      const { password: _, two_factor_secret: __, ...userWithoutSensitive } = user;
      const token = generateToken(userWithoutSensitive);

      return reply.send({
        success: true,
        token: token,
        user: userWithoutSensitive
      });
    } catch (err) {
      console.error('Login error:', err);
      return reply.code(500).send({ message: 'Server error' });
    }
  });

  // 2FA Setup - Generate secret and QR code
  fastify.post('/2fa/setup', async (request, reply) => {
    try {
      // Get token from Authorization header
      const authHeader = request.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
      }

      // Get user info
      const user = await getUserByUsername(decoded.username);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Generate 2FA secret and QR code
      const { secret, qr_code } = await generate2FASecret(user.username, user.email);

      // Save secret temporarily (will be enabled after verification)
      await save2FASecret(user.id, secret);

      return reply.send({
        secret: secret, // For manual entry if QR code doesn't work
        qr_code: qr_code
      });
    } catch (err) {
      console.error('2FA setup error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // 2FA Verify Setup - Verify code and enable 2FA
  fastify.post('/2fa/verify-setup', async (request, reply) => {
    try {
      const { code } = request.body;

      if (!code || code.length !== 6) {
        return reply.code(400).send({ error: 'Invalid code format' });
      }

      // Get token from Authorization header
      const authHeader = request.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
      }

      // Get user and their 2FA secret
      const user = await getUserByUsername(decoded.username);
      if (!user || !user.two_factor_secret) {
        return reply.code(400).send({ error: '2FA setup not initiated' });
      }

      // Verify the code
      const isValid = verify2FAToken(code, user.two_factor_secret);
      if (!isValid) {
        return reply.code(401).send({ error: 'Invalid verification code' });
      }

      // Enable 2FA
      await enable2FA(user.id);

      return reply.send({ success: true, message: '2FA enabled successfully' });
    } catch (err) {
      console.error('2FA verify setup error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Check 2FA status
  fastify.get('/2fa/status', async (request, reply) => {
    try {
      // Get token from Authorization header
      const authHeader = request.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
      }

      // Get user info
      const user = await getUserByUsername(decoded.username);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Check if 2FA is enabled
      const has2FA = await is2FAEnabled(user.id);

      return reply.send({
        enabled: has2FA
      });
    } catch (err) {
      console.error('2FA status check error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });

  // Disable 2FA
  fastify.post('/2fa/disable', async (request, reply) => {
    try {
      // Get token from Authorization header
      const authHeader = request.headers.authorization;
      const token = extractTokenFromHeader(authHeader);

      if (!token) {
        return reply.code(401).send({ error: 'Authentication required' });
      }

      // Verify token
      const decoded = verifyToken(token);
      if (!decoded) {
        return reply.code(401).send({ error: 'Invalid or expired token' });
      }

      // Get user info
      const user = await getUserByUsername(decoded.username);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Disable 2FA
      await disable2FA(user.id);

      return reply.send({ success: true, message: '2FA disabled successfully' });
    } catch (err) {
      console.error('2FA disable error:', err);
      return reply.code(500).send({ error: 'Server error' });
    }
  });
}

module.exports = authRoutes;
