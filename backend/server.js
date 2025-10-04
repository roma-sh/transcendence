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

// ⭐️ ΝΕΟ ROUTE ΓΙΑ ΕΝΗΜΕΡΩΣΗ ΣΤΑΤΙΣΤΙΚΩΝ ΠΑΙΧΝΙΔΙΟΥ ⭐️
app.post('/api/updateStats', (request, reply) => {
    // Fastify automatically parses JSON body
    const { winner, loser } = request.body;

    if (!winner || !loser) {
        return reply.code(400).send({ error: 'Missing winner or loser alias.' });
    }

    // 1. Ενημέρωση του Νικητή (προσθήκη νίκης και συνολικού παιχνιδιού)
    user_db.run(
        `UPDATE users SET wins = wins + 1, total_games = total_games + 1 WHERE username = ?`,
        [winner],
        function(err) {
            if (err) {
                console.error('Error updating winner stats:', err.message);
                return reply.code(500).send({ error: 'Database error while updating winner.' });
            }
            
            // 2. Ενημέρωση του Ηττημένου (προσθήκη μόνο συνολικού παιχνιδιού)
            user_db.run(
                `UPDATE users SET total_games = total_games + 1 WHERE username = ?`,
                [loser],
                function(err) {
                    if (err) {
                        console.error('Error updating loser stats:', err.message);
                        // Επιστρέφουμε 500/503 αν αποτύχει η βάση.
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

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
