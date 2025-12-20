const { updateStats } = require('../controllers/stats.controller');

async function statsRoutes(fastify) {
  fastify.post('/', updateStats);
}

module.exports = statsRoutes;
