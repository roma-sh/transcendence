const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const user_db = new sqlite3.Database(path.join(__dirname, '../database/user_db.db'), 
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
  wins INTEGER,
  two_factor_secret TEXT,
  two_factor_enabled INTEGER DEFAULT 0
)`);

// Add 2FA columns to existing tables (safe to run multiple times)
user_db.run(`ALTER TABLE users ADD COLUMN two_factor_secret TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('Error adding two_factor_secret column:', err.message);
  }
});

user_db.run(`ALTER TABLE users ADD COLUMN two_factor_enabled INTEGER DEFAULT 0`, (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('Error adding two_factor_enabled column:', err.message);
  }
});

module.exports = user_db;