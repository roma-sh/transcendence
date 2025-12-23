const { signupController, loginController, logoutController } = require('../controllers/auth.controller');

async function authRoutes(fastify) {
  fastify.post('/signup', signupController);
  fastify.post("/login", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: "1 minute",
      },
    },
  }, loginController);
  fastify.post('/logout', logoutController);
}

module.exports = authRoutes;
