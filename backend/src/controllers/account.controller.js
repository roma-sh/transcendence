const { getUserById } = require('../services/profile.service');
const { deleteUserById } = require('../services/account.service');
const path = require('path');
const fs = require('fs').promises;

async function deleteAccountController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.send({ success: false, message: 'User not found' });
    }

    if (user.profile_picture) {
      const picturePath = path.join(__dirname, '../../../public/uploads/profiles', user.profile_picture);
      try {
        await fs.unlink(picturePath);
      } catch (unlinkErr) {
        // File may already be missing — not a blocking error
      }
    }

    const changes = await deleteUserById(userId);
    if (changes === 0) {
      return reply.send({ success: false, message: 'User not found' });
    }

    await request.session.destroy();

    return reply.send({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.send({ success: false, message: 'Server error' });
  }
}

module.exports = { deleteAccountController };
