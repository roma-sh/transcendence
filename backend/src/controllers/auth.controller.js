const { insertUser, getUser } = require('../services/auth.service');
const { setUserOnline, setUserOffline } = require('../services/profile.service');
const { isValidEmail, isStrongPassword, isValidUsername } = require('../utils/validators');
const { get2FAStatus } = require('../services/twoFactor.service');
const { generateToken } = require('../services/jwt.service');


async function signupController(request, reply) {
  const { username, email, password } = request.body;

  if (!username || !email || !password) {
    return reply.code(400).send({ error: 'All fields are required' });
  }

  if (!isValidUsername(username)) {
    return reply.code(400).send({
      error: 'Invalid username. Must be at least 3 characters and contain only letters, numbers, or underscores.'
    });
  }

  if (!isValidEmail(email)) {
    return reply.code(400).send({
      error: 'Invalid email format. Please enter a valid email.'
    });
  }

  if (!isStrongPassword(password)) {
    return reply.code(400).send({
      error:
        'Weak password. Must be 8+ characters and include upper & lower case letters, a number, and a special character.'
    });
  }

  try {
    const newId = await insertUser(username, email, password);
    return reply.code(201).send({ message: 'User created', id: newId });
  } catch (err) {
    request.log.error(err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return reply.code(409).send({ error: 'Username or email already exists' });
    }
    return reply.code(500).send({ error: 'Failed to create user' });
  }
}

async function loginController(request, reply) {
  const { username, password, twoFactorToken, userId } = request.body;

  if (userId && twoFactorToken) {
    try {
      const { getUserById, verifyToken } = require('../services/twoFactor.service');
      const user = await getUserById(userId);
      
      if (!user) {
        return reply.code(404).send({ message: 'User not found' });
      }

      const status = await get2FAStatus(user.id);
      if (!status || !status.two_factor_enabled || !status.two_factor_secret) {
        return reply.code(400).send({ message: '2FA not enabled for this user' });
      }

      const isValid = verifyToken(status.two_factor_secret, twoFactorToken);
      if (!isValid) {
        return reply.code(401).send({ message: 'Invalid 2FA token' });
      }

      const updated = await setUserOnline(user.id);
      if (updated === 0) {
        console.warn(`Warning: user ${user.id} found but online status was NOT updated`);
      }

      request.session.userId = user.id;
      request.session.username = user.username;
      await new Promise((resolve, reject) => {
        if (typeof request.session.save === 'function') {
          request.session.save((err) => (err ? reject(err) : resolve()));
        } else {
          resolve();
        }
      });

      const jwtToken = generateToken(user);
      return reply.send({ 
        message: 'Logged in', 
        token: jwtToken,
        user: { id: user.id, username: user.username, email: user.email } 
      });
    } catch (err) {
      request.log.error(err);
      return reply.code(500).send({ message: 'Server error' });
    }
  }

  // Normal login flow
  if (!username || !password) {
    return reply.code(400).send({ message: 'Missing credentials' });
  }

  try {
    const user = await getUser(username, password);
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const status = await get2FAStatus(user.id);
    const is2FAEnabled = status && status.two_factor_enabled === 1;

    if (is2FAEnabled) {
      if (!twoFactorToken) {
        return reply.code(200).send({ 
          requires2FA: true, 
          userId: user.id,
          message: '2FA token required' 
        });
      }

      const { verifyToken } = require('../services/twoFactor.service');
      const isValid = verifyToken(status.two_factor_secret, twoFactorToken);

      if (!isValid) {
        return reply.code(401).send({ message: 'Invalid 2FA token' });
      }
    }

    const updated = await setUserOnline(user.id);
    if (updated === 0) {
      console.warn(`Warning: user ${user.id} found but online status was NOT updated`);
    }

    request.session.userId = user.id;
    request.session.username = user.username;
    await new Promise((resolve, reject) => {
      if (typeof request.session.save === 'function') {
        request.session.save((err) => (err ? reject(err) : resolve()));
      } else {
        resolve();
      }
    });

    //Generate JWT token
    const jwtToken = generateToken(user);

    return reply.send({ 
      message: 'Logged in', 
      token: jwtToken,
      user: { id: user.id, username: user.username, email: user.email } 
    });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}

async function logoutController(request, reply) {
  const userId = request.session?.userId;
  if (userId) {
    try {
      await setUserOffline(userId);
    } catch (err) {
      request.log.error('Error setting user offline:', err);
    }
  }
  try {
    if (request.session?.destroy) {
      await request.session.destroy();
    }
  } catch (err) {
    request.log.error('Error destroying session:', err);
  }
  return reply.send({ message: 'Logged out successfully' });
}

module.exports = { signupController, loginController, logoutController };
