const { getUserById, updatePassword } = require('../services/profile.service');
const { isUserOnline } = require('../services/profile.service');
const {isStrongPassword} = require('../utils/validators');
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


module.exports = { profileController , isUserOnlineController, changePasswordController};
