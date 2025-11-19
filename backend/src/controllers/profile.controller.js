const { getUserById } = require('../services/profile.service');

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

module.exports = { profileController };
