const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

// Get user by ID
function getUserById(userId) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT id, username, email FROM users WHERE id = ?`,
      [userId],
      (err, row) => {
        if (err) return reject(err);
        resolve(row); // row will be undefined if not found
      }
    );
  });
}

module.exports = { getUserById };
