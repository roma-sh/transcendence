const db = require('../db/db');

function checkAliasExists(alias) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT username FROM users WHERE username = ?`;
    db.get(sql, [alias], (err, row) => {
      if (err) return reject(err);
      resolve(!!row);
    });
  });
}

module.exports = { checkAliasExists };
