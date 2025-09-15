-- Erstellt Tabelle "users", falls noch nicht vorhanden
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Optional: Dummy-Einträge für Tests
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
