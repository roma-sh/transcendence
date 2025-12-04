const path = require('path');
const user_db = require(path.join(__dirname, '../db/db'));


// this functon inserts a new user into the database
// and returns a promise that resolves to the new user's ID
function insertUser(username, email, password) {
  // promise is an object from java-script
  // we use it because database are slow in comparison to code execution
  // so we use promise to wait for the database to respond and store the data in it
  return new Promise((resolve, reject) => {
    user_db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password],
      function (err) {
        if (err) return reject(err);
        // run function give to us lastID which is the number of the last inserted row
        // and give also the number of changes made in this.changes
        resolve(this.lastID); // return the new user's ID to the caller "signupController"
      }
    );
  });
}


// ################################################


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


// ################################################






module.exports = { insertUser, getUser };
