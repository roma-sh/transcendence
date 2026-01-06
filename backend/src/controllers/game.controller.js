const { incrementTotalGames, incrementWins } = require('../services/game.service');

async function incrementTotalGamesController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ message: 'Not logged in' });
  }

  try {
    const updated = await incrementTotalGames(userId);

    if (updated === 0) {
      return reply.code(404).send({ message: 'User not found' });
    }

    return reply.send({ message: 'Total games incremented successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}

async function incrementWinsController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.code(401).send({ message: 'Not logged in' });
  }

  try {
    const updated = await incrementWins(userId);

    if (updated === 0) {
      return reply.code(404).send({ message: 'User not found' });
    }

    return reply.send({ message: 'Wins incremented successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}

module.exports = { incrementTotalGamesController, incrementWinsController };