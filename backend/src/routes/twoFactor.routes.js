const {
  setup2FAController,
  verifyAndEnable2FAController,
  disable2FAController,
  get2FAStatusController,
  verify2FATokenController
} = require('../controllers/twoFactor.controller');

async function twoFactorRoutes(fastify) {
  fastify.get('/setup', setup2FAController);
  fastify.post('/verify-enable', verifyAndEnable2FAController);
  fastify.post('/disable', disable2FAController);
  fastify.get('/status', get2FAStatusController);
  fastify.post('/verify', verify2FATokenController);
}

module.exports = twoFactorRoutes;
