const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));

function insertUser(username, email, password) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

function getUser(identifier, password) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?`,
      [identifier, identifier, password],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

module.exports = { insertUser, getUser };
