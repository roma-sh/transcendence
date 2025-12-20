const StatsService = require('../services/stats.service');

async function updateStats(request, reply) {
  const { winner, loser } = request.body;

  if (!winner || !loser) {
    return reply.code(400).send({ error: 'Missing winner or loser alias.' });
  }

  try {
    await StatsService.updateWinner(winner);
    await StatsService.updateLoser(loser);
    reply.send({ message: 'Stats updated successfully' });
  } catch (err) {
    reply.code(500).send({ error: 'Database error' });
  }
}

module.exports = { updateStats };
