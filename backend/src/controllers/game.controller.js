const { incrementTotalGames, incrementWins } = require('../services/game.service');

async function incrementTotalGamesController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  try {
    const updated = await incrementTotalGames(userId);

    if (updated === 0) {
      return reply.send({ success: false, message: 'User not found' });
    }

    return reply.send({ success: true, message: 'Total games incremented successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.send({ success: false, message: 'Server error' });
  }
}

async function incrementWinsController(request, reply) {
  const userId = request.session.userId;

  if (!userId) {
    return reply.send({ success: false, message: 'Not logged in' });
  }

  try {
    const updated = await incrementWins(userId);

    if (updated === 0) {
      return reply.send({ success: false, message: 'User not found' });
    }

    return reply.send({ success: true, message: 'Wins incremented successfully' });
  } catch (err) {
    request.log.error(err);
    return reply.send({ success: false, message: 'Server error' });
  }
}

module.exports = { incrementTotalGamesController, incrementWinsController };