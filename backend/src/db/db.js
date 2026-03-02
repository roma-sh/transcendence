const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || "/usr/src/database/user_db.db";

const user_db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at:', dbPath);
  }
});

user_db.exec("PRAGMA journal_mode = WAL;");

user_db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    total_games INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    is_online INTEGER DEFAULT 0,
    is_oauth INTEGER DEFAULT 0,
    profile_picture TEXT DEFAULT NULL,
    two_factor_secret TEXT DEFAULT NULL,
    two_factor_enabled INTEGER DEFAULT 0
  )
`);

const gracefulShutdown = () => {
  user_db.close((err) => {
    if (err) console.error('Error closing database:', err);
    else console.log('Database connection closed');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

module.exports = user_db;
