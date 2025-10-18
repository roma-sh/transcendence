const path = require('path');
const user_db = require(path.join(__dirname, '../db'));
/**
 * Insert a new user into the database
 */
function insertUser(username, email, password) {
  return new Promise((resolve, reject) => {
    user_db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, password],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

/**
 * Get user from the database by username and password
 */
function getUser(username, password) {
  return new Promise((resolve, reject) => {
    user_db.get(
      `SELECT * FROM users WHERE username = ? AND password = ?`,
      [username, password],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

/**
 * Register authentication routes
 */
async function authRoutes(fastify) {
  // Signup
  fastify.post('/signup', async (request, reply) => {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return reply.code(400).send({ error: 'All fields are required' });
    }

    try {
      const userId = await insertUser(username, email, password);
      return reply.send({ success: true, userId });
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return reply.code(409).send({ error: 'Email already exists' });
      }
      return reply.code(500).send({ error: 'Server error', details: err.message });
    }
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;

    try {
      const user = await getUser(username, password);
      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }
      return reply.send({ user });
    } catch (err) {
      console.error('Login error:', err);
      return reply.code(500).send({ message: 'Server error' });
    }
  });
}

module.exports = authRoutes;
