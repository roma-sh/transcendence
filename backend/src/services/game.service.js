const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

function incrementTotalGames(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET total_games = total_games + 1 WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

function incrementWins(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET wins = wins + 1 WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

module.exports = { incrementTotalGames, incrementWins };