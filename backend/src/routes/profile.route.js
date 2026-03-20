const {
  profileController,
  isUserOnlineController,
  changePasswordController,
  changeUsernameController,
  changeEmailController,
  updateProfilePictureController,
} = require('../controllers/profile.controller');

async function profileRoutes(fastify) {
  fastify.get('/profile', profileController);
  fastify.get('/useronline', isUserOnlineController);
  fastify.put('/profile/password', changePasswordController);
  fastify.put('/profile/username', changeUsernameController);
  fastify.put('/profile/email', changeEmailController);
  fastify.put('/profile/picture', updateProfilePictureController);
}

module.exports = profileRoutes;
