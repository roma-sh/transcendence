const { getUserById, updatePassword, updateUsername, updateEmail, updateProfilePicture} = require('../services/profile.service');
const { isUserOnline } = require('../services/profile.service');
const { isStrongPassword, isValidUsername, isValidEmail } = require('../utils/validators');
const { getUser } = require('../services/auth.service');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

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

async function updateProfilePictureController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ message: 'Not logged in' });
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
      return reply.send({ message: 'Profile picture removed', profile_picture: null });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.code(400).send({ message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' });
    }

    const maxSize = 5 * 1024 * 1024;
    const fileBuffer = await data.toBuffer();
    if (fileBuffer.length > maxSize) {
      return reply.code(400).send({ message: 'File too large. Maximum size is 5MB' });
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
      message: 'Profile picture updated successfully',
      profile_picture: uniqueFilename,
      url: `/uploads/profiles/${uniqueFilename}`
    });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}

module.exports = {
  profileController,
  changePasswordController,
  changeUsernameController,
  changeEmailController,
  isUserOnlineController,
  updateProfilePictureController
};
