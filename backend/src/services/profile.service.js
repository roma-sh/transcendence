const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

function getUserById(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT id, username, email, is_online, total_games, wins, profile_picture, is_oauth FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
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
        if (!row) return resolve(null);
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

        resolve(this.changes);
      }
    );
  });
}

function updatePassword(userId, newPassword) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET password = ? WHERE id = ?`,
      [newPassword, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

function updateUsername(userId, newUsername) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET username = ? WHERE id = ?`,
      [newUsername, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

function updateEmail(userId, newEmail) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET email = ? WHERE id = ?`,
      [newEmail, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

function updateProfilePicture(userId, filename) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `UPDATE users SET profile_picture = ? WHERE id = ?`,
      [filename, userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

module.exports = {
  getUserById,
  setUserOnline,
  isUserOnline,
  setUserOffline,
  updatePassword,
  updateUsername,
  updateEmail,
  updateProfilePicture,
};
