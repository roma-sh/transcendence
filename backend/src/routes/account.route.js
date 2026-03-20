const { deleteAccountController } = require('../controllers/account.controller');

async function accountRoutes(fastify) {
  fastify.delete('/delete', deleteAccountController);
}

module.exports = accountRoutes;
