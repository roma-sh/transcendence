const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database is outside backend folder
const dbPath = path.join(__dirname, '../../../database/user_db.db');

const user_db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at:', dbPath);
  }
});

user_db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    total_games INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0
    online INTEGER DEFAULT 0
  )
`);

module.exports = user_db;
