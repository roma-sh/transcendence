const { profileController, isUserOnlineController } = require('../controllers/profile.controller');

async function profileRoutes(fastify) {
  fastify.get('/profile', profileController);
  fastify.get('/useronline', isUserOnlineController);
}

module.exports = profileRoutes;
