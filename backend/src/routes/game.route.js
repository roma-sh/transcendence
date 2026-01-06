const { incrementTotalGamesController, incrementWinsController } = require('../controllers/game.controller');

async function gameRoutes(fastify) {
  fastify.post('/total-games', incrementTotalGamesController);
  fastify.post('/wins', incrementWinsController);
}

module.exports = gameRoutes;