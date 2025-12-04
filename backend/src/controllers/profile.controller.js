const { getUserById } = require('../services/profile.service');
const { isUserOnline } = require('../services/profile.service');


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



module.exports = { profileController , isUserOnlineController};
