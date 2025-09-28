const Fastify = require('fastify');
const path = require('path');
const fastifyStatic = require('@fastify/static');

const app = Fastify({ logger: true });

// server.js (ή routes/userRoutes.js)
const user_db = require('./db'); // the connection with the database


// checking the database for the alias name
app.get('/api/checkAlias/:alias', (request, reply) => {
  const { alias } = request.params;
  const sql = `SELECT username FROM users WHERE username = ?`;

  user_db.get(sql, [alias], (err, row) => {
    if (err) {
      return reply.code(500).send({ error: 'Database error' });
    }
    
    // if row exists, means it's in the database
    if (row) {
      return reply.code(200).send({ exists: true });
    } else {
      return reply.code(200).send({ exists: false });
    }
  });
});

// Register route files
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/', 
});
app.register(authRoutes, { prefix: '/api/auth' });
// app.register(userRoutes, { prefix: '/api/users' });

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});