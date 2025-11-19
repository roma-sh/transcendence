const { profileController } = require('../controllers/profile.controller');

async function profileRoutes(fastify) {
  fastify.get('/profile', profileController);
}

module.exports = profileRoutes;
