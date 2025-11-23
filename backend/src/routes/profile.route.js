const { profileController, isUserOnlineController } = require('../controllers/profile.controller');

async function profileRoutes(fastify) {
  // Get current user's profile
  fastify.get('/profile', profileController);

  // Check if a user is online by ID
  fastify.get('/useronline', isUserOnlineController);
}

module.exports = profileRoutes;
