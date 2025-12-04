const db = require('../db/db');

function updateWinner(winner) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET wins = wins + 1, total_games = total_games + 1 WHERE username = ?`,
      [winner],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

function updateLoser(loser) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET total_games = total_games + 1 WHERE username = ?`,
      [loser],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

module.exports = { updateWinner, updateLoser };
