const path = require('path');
const bcrypt = require('bcryptjs');
const user_db = require(path.join(__dirname, '../db/db'));

async function insertUser(username, email, password) {
  const hash = await bcrypt.hash(password, 12);
  return new Promise((resolve, reject) => {
    user_db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hash],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

async function getUser(identifier, password) {
  const row = await new Promise((resolve, reject) => {
    user_db.get(
      `SELECT * FROM users WHERE (username = ? OR email = ?)`,
      [identifier, identifier],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
  if (!row) return null;
  if (row.is_oauth) return null; // OAuth users cannot login via password
  const match = await bcrypt.compare(password, row.password);
  return match ? row : null;
}

module.exports = { insertUser, getUser };
