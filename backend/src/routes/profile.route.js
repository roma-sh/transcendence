const {
  profileController,
  getPublicProfileController,
  isUserOnlineController,
  changePasswordController,
  changeUsernameController,
  changeEmailController,
} = require('../controllers/profile.controller');

async function profileRoutes(fastify) {
  fastify.get('/profile', profileController);
  fastify.get('/useronline', isUserOnlineController);
  fastify.put('/profile/password', changePasswordController);
  fastify.put('/profile/username', changeUsernameController);
  fastify.put('/profile/email', changeEmailController);
}

module.exports = profileRoutes;
