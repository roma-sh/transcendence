const { profileController, isUserOnlineController, changePasswordController} = require('../controllers/profile.controller');

async function profileRoutes(fastify) {
  fastify.get('/profile', profileController);
  fastify.get('/useronline', isUserOnlineController);
  fastify.put('/profile/password', changePasswordController);
}

module.exports = profileRoutes;
