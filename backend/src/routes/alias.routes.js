const { checkAlias } = require('../controllers/alias.controller');

async function aliasRoutes(fastify) {
  fastify.get('/:alias', checkAlias);
}

module.exports = aliasRoutes;
