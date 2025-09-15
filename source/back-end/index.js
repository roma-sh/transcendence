const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// DB Verbindung
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// kleine Middleware
app.use(express.json());

// simple Test-Route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Dummy: User in DB anlegen
app.post("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING id, name",
      [req.body.name || "Anonymous"]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

// User-Liste
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
