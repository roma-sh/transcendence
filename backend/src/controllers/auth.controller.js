const { insertUser, getUser } = require('../services/auth.service');
const { setUserOnline, setUserOffline } = require('../services/profile.service');
const { isValidEmail, isStrongPassword, isValidUsername } = require('../utils/validators');


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
    return reply.code(500).send({ error: 'Failed to create user' });
  }
}

async function loginController(request, reply) {
  const { username, password } = request.body; // frontend sends identifier as "username"
  if (!username || !password) {
    return reply.code(400).send({ message: 'Missing credentials' });
  }

  try {
    const user = await getUser(username, password);
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
  const updated = await setUserOnline(user.id);

  if (updated === 0) {
    console.warn(`Warning: user ${user.id} found but online status was NOT updated`);
  }

    request.session.userId = user.id;
    await new Promise((resolve, reject) => {
      if (typeof request.session.save === 'function') {
        request.session.save((err) => (err ? reject(err) : resolve()));
      } else {
        resolve();
      }
    });

    return reply.send({ message: 'Logged in', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}

async function logoutController(request, reply) {
  const userId = request.session.userId;
  if (userId) {
    try {
      await setUserOffline(userId);
    } catch (err) {
      request.log.error('Error setting user offline:', err);
    }
  }
  await request.session.destroy();
  return reply.send({ message: 'Logged out successfully' });
}

module.exports = { signupController, loginController, logoutController };
