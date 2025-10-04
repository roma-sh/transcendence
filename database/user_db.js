const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const user_db = new sqlite3.Database(path.join(__dirname, 'user_db.db'),
(err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Χρησιμοποιούμε serialize για να διασφαλίσουμε ότι οι εντολές εκτελούνται σειριακά.
user_db.serialize(() => {
    // 1. Δημιουργία ή Ενημέρωση Πίνακα με DEFAULT 0
    user_db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      total_games INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0
    )`);

    // 2. Migration: Προσθήκη στηλών wins και total_games σε υπάρχουσες βάσεις.
    // Αυτό είναι απαραίτητο αν η βάση δημιουργήθηκε πριν προστεθούν οι στήλες.
    
    // Προσθήκη στήλης wins
    user_db.run(`ALTER TABLE users ADD COLUMN wins INTEGER DEFAULT 0`, function(err) {
        if (err && !err.message.includes('duplicate column name')) {
            // Αγνοούμε το σφάλμα αν η στήλη υπάρχει ήδη
            console.error('Migration error (wins):', err.message);
        }
    });

    // Προσθήκη στήλης total_games
    user_db.run(`ALTER TABLE users ADD COLUMN total_games INTEGER DEFAULT 0`, function(err) {
        if (err && !err.message.includes('duplicate column name')) {
            // Αγνοούμε το σφάλμα αν η στήλη υπάρχει ήδη
            console.error('Migration error (total_games):', err.message);
        }
    });
});

module.exports = user_db;