const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const user_db = new sqlite3.Database(path.join(__dirname, 'user_db.db'), // Use user_bd.db here
(err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

user_db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  total_games INTEGER,
  wins INTEGER
)`);

module.exports = user_db;