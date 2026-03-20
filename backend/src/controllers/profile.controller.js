const { getUserById, updatePassword, updateUsername, updateEmail, updateProfilePicture} = require('../services/profile.service');
const { isUserOnline } = require('../services/profile.service');
const { isStrongPassword, isValidUsername, isValidEmail } = require('../utils/validators');
const { getUser } = require('../services/auth.service');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

async function profileController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.send({ success: false, user: null, message: 'Not logged in' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.send({ success: false, user: null, message: 'User not found' });
    }

    return reply.send({ success: true, user });
  } catch (err) {
    console.error('Profile error:', err);
    return reply.send({ success: false, user: null, message: 'Server error' });
  }
}

async function isUserOnlineController(request, reply) {
  const userId = request.session.userId; // get logged-in user ID

  if (!userId) {
    return reply.send({
      userId: null,
      username: null,
      online: false,
      authenticated: false,
    });
  }

  try {
    const online = await isUserOnline(userId);

    if (online === null) {
      return reply.send({
        userId,
        username: request.session.username || null,
        online: false,
        authenticated: false,
      });
    }

    return reply.send({
      userId,
      username: request.session.username || null,
      online: online === 1, // convert 0/1 to boolean
      authenticated: true,
    });

  } catch (err) {
    request.log.error(err);
    return reply.send({ success: false, message: "Server error" });
  }
}

async function changePasswordController(request, reply) {
  const userId = request.session.userId;
  const { currentPassword, newPassword } = request.body;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  if (!currentPassword || !newPassword) {
    return reply.send({ success: false, message: 'Current password and new password are required' });
  }

  if (!isStrongPassword(newPassword)) {
    return reply.send({
      success: false,
      message: 'Weak password. Must be 8+ characters and include upper & lower case letters, a number, and a special character.'
    });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.send({ success: false, message: 'User not found' });
    }

    if (user.is_oauth) {
      return reply.send({ success: false, message: 'OAuth users cannot change password' });
    }

    const verifiedUser = await getUser(user.username, currentPassword);
    if (!verifiedUser) {
      return reply.send({ success: false, message: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await updatePassword(userId, newHash);
    return reply.send({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.send({ success: false, message: 'Server error' });
  }
}


async function changeUsernameController(request, reply) {
  const userId = request.session.userId;
  const { newUsername } = request.body;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  if (!newUsername) {
    return reply.send({ success: false, message: 'New username is required' });
  }

  if (!isValidUsername(newUsername)) {
    return reply.send({
      success: false,
      message: 'Invalid username. Must be at least 3 characters and contain only letters, numbers, or underscores.'
    });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.send({ success: false, message: 'User not found' });
    }

    await updateUsername(userId, newUsername);
    return reply.send({ success: true, message: 'Username updated successfully', username: newUsername });
  } catch (err) {
    request.log.error(err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return reply.send({ success: false, message: 'Username already exists' });
    }
    return reply.send({ success: false, message: 'Server error' });
  }
}

async function changeEmailController(request, reply) {
  const userId = request.session.userId;
  const { newEmail } = request.body;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  if (!newEmail) {
    return reply.send({ success: false, message: 'New email is required' });
  }

  if (!isValidEmail(newEmail)) {
    return reply.send({ success: false, message: 'Invalid email format' });
  }

  try {
    const user = await getUserById(userId);
    if (!user) {
      return reply.send({ success: false, message: 'User not found' });
    }

    await updateEmail(userId, newEmail);
    return reply.send({ success: true, message: 'Email updated successfully', email: newEmail });
  } catch (err) {
    request.log.error(err);
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return reply.send({ success: false, message: 'Email already exists' });
    }
    return reply.send({ success: false, message: 'Server error' });
  }
}

async function updateProfilePictureController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  try {
    const data = await request.file();

    if (!data) {
      const user = await getUserById(userId);
      if (user && user.profile_picture) {
        const oldFilePath = path.join(__dirname, '../../../public/uploads/profiles', user.profile_picture);
        try {
          await fs.unlink(oldFilePath);
        } catch (err) {
        }
      }

      await updateProfilePicture(userId, null);
      return reply.send({ success: true, message: 'Profile picture removed', profile_picture: null });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.send({ success: false, message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' });
    }

    const maxSize = 5 * 1024 * 1024;
    const fileBuffer = await data.toBuffer();
    if (fileBuffer.length > maxSize) {
      return reply.send({ success: false, message: 'File too large. Maximum size is 5MB' });
    }

    const fileExtension = path.extname(data.filename);
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;

    const uploadsDir = path.join(__dirname, '../../../public/uploads/profiles');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (err) {
    }

    const user = await getUserById(userId);
    if (user && user.profile_picture) {
      const oldFilePath = path.join(uploadsDir, user.profile_picture);
      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
      }
    }

    const filePath = path.join(uploadsDir, uniqueFilename);
    await fs.writeFile(filePath, fileBuffer);

    await updateProfilePicture(userId, uniqueFilename);

    return reply.send({
      success: true,
      message: 'Profile picture updated successfully',
      profile_picture: uniqueFilename,
      url: `/uploads/profiles/${uniqueFilename}`
    });
  } catch (err) {
    request.log.error(err);
    return reply.send({ success: false, message: 'Server error' });
  }
}

module.exports = {
  profileController,
  changePasswordController,
  changeUsernameController,
  changeEmailController,
  isUserOnlineController,
  updateProfilePictureController,
};
