const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

function deleteUserById(userId) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `DELETE FROM users WHERE id = ?`,
      [userId],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

module.exports = { deleteUserById };
