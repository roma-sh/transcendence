const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

// Get user by ID
function getUserById(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT id, username, email, is_online FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row); // row will be undefined if not found
      }
    );
  });
}

function setUserOnline(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET is_online = 1 WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);

        // this.changes tells you how many rows were updated
        resolve(this.changes);
      }
    );
  });
}

function isUserOnline(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT is_online FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);

        // If no user found → return null
        if (!row) return resolve(null);

        // row.online is 0 or 1
        resolve(row.is_online);
      }
    );
  });
}

function setUserOffline(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET is_online = 0 WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);

        // this.changes tells you how many rows were updated
        resolve(this.changes);
      }
    );
  });
}

module.exports = { getUserById , setUserOnline , isUserOnline, setUserOffline};
