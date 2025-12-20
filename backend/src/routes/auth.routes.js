const { signupController, loginController, logoutController } = require('../controllers/auth.controller');

async function authRoutes(fastify) {
  fastify.post('/signup', signupController);
  fastify.post('/login', loginController);
  fastify.post('/logout', logoutController);
}

module.exports = authRoutes;
