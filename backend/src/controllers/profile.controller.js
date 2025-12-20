const { getUserById, updatePassword, updateUsername, updateEmail } = require('../services/profile.service');
const { isUserOnline } = require('../services/profile.service');
const { isStrongPassword, isValidUsername, isValidEmail } = require('../utils/validators');
const { getUser } = require('../services/auth.service');

async function profileController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ user: null, message: 'Not logged in' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.code(404).send({ user: null, message: 'User not found' });
    }

    return reply.send({ user });
  } catch (err) {
    console.error('Profile error:', err);
    return reply.code(500).send({ user: null, message: 'Server error' });
  }
}

async function isUserOnlineController(request, reply) {
  const userId = request.session.userId; // get logged-in user ID

  if (!userId) {
    return reply.code(401).send({ message: "Not logged in" });
  }

  try {
    const online = await isUserOnline(userId);

    if (online === null) {
      return reply.code(404).send({ message: "User not found" });
    }

    return reply.send({
      userId,
      online: online === 1 // convert 0/1 to boolean
    });

  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: "Server error" });
  }
}


async function changePasswordController(request, reply) {
  const userId = request.session.userId;
  const { currentPassword, newPassword } = request.body;

  if (!userId) {
    return reply.code(401).send({ message: 'Not logged in' });
  }

  if (!currentPassword || !newPassword) {
    return reply.code(400).send({ message: 'Current password and new password are required' });
  }

  if (!isStrongPassword(newPassword)) {
    return reply.code(400).send({
      message: 'Weak password. Must be 8+ characters and include upper & lower case letters, a number, and a special character.'
    });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    const verifiedUser = await getUser(user.username, currentPassword);
    if (!verifiedUser) {
      return reply.code(401).send({ message: 'Current password is incorrect' });
    }

    await updatePassword(userId, newPassword);
    return reply.send({ message: 'Password updated successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}


async function changeUsernameController(request, reply) {
  const userId = request.session.userId;
  const { newUsername } = request.body;

  if (!userId) {
    return reply.code(401).send({ message: 'Not logged in' });
  }

  if (!newUsername) {
    return reply.code(400).send({ message: 'New username is required' });
  }

  if (!isValidUsername(newUsername)) {
    return reply.code(400).send({
      message: 'Invalid username. Must be at least 3 characters and contain only letters, numbers, or underscores.'
    });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    await updateUsername(userId, newUsername);
    return reply.send({ message: 'Username updated successfully', username: newUsername });
  } catch (err) {
    request.log.error(err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return reply.code(409).send({ message: 'Username already exists' });
    }
    return reply.code(500).send({ message: 'Server error' });
  }
}

async function changeEmailController(request, reply) {
  const userId = request.session.userId;
  const { newEmail } = request.body;

  if (!userId) {
    return reply.code(401).send({ message: 'Not logged in' });
  }

  if (!newEmail) {
    return reply.code(400).send({ message: 'New email is required' });
  }

  if (!isValidEmail(newEmail)) {
    return reply.code(400).send({ message: 'Invalid email format' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.code(404).send({ message: 'User not found' });
    }

    await updateEmail(userId, newEmail);
    return reply.send({ message: 'Email updated successfully', email: newEmail });
  } catch (err) {
    request.log.error(err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return reply.code(409).send({ message: 'Email already exists' });
    }
    return reply.code(500).send({ message: 'Server error' });
  }
}

module.exports = {
  profileController,
  changePasswordController,
  changeUsernameController,
  changeEmailController,
  isUserOnlineController
};
