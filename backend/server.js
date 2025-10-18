const Fastify = require('fastify');
const path = require('path');
const fastifyStatic = require('@fastify/static');
const fastifyCors = require('@fastify/cors'); 

const app = Fastify({ logger: true });

app.register(fastifyCors, {
    origin: '*', 
    methods: ['GET', 'POST', 'OPTIONS'],
    // Also, added this to allow the necessary headers
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'], 
});

// server.js (or routes/userRoutes.js)
const user_db = require('./db'); // the connection with the database


// checking the database for the alias name
app.get('/api/checkAlias/:alias', (request, reply) => {
  const { alias } = request.params;
  const sql = `SELECT username FROM users WHERE username = ?`;

  user_db.get(sql, [alias], (err, row) => {
    if (err) {
      // Returning 500 for internal database errors
      return reply.code(500).send({ error: 'Database error' });
    }
    
    // if row exists, it means the user is found in the database
    if (row) {
      return reply.code(200).send({ exists: true });
    } else {
      return reply.code(200).send({ exists: false });
    }
  });
});

// ⭐️ NEW ROUTE FOR UPDATING GAME STATISTICS ⭐️
app.post('/api/updateStats', (request, reply) => {
    // Fastify automatically parses JSON body
    const { winner, loser } = request.body;

    if (!winner || !loser) {
        return reply.code(400).send({ error: 'Missing winner or loser alias.' });
    }

    // 1. Update the Winner (add a win and a total game count)
    user_db.run(
        // NOTE: The total_games update seems redundant in the winner's query, 
        // as it's updated in the loser's query, but it ensures total_games is updated correctly for the winner too.
        `UPDATE users SET wins = wins + 1, total_games = total_games + 1 WHERE username = ?`,
        [winner],
        function(err) {
            if (err) {
                console.error('Error updating winner stats:', err.message);
                return reply.code(500).send({ error: 'Database error while updating winner.' });
            }
            
            // 2. Update the Loser (add only to total game count)
            user_db.run(
                `UPDATE users SET total_games = total_games + 1 WHERE username = ?`,
                [loser],
                function(err) {
                    if (err) {
                        console.error('Error updating loser stats:', err.message);
                        // Return 500/503 if the database fails.
                        return reply.code(500).send({ error: 'Database error while updating loser.' });
                    }
                    reply.code(200).send({ message: 'Stats updated successfully' });
                }
            );
        }
    );
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

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});