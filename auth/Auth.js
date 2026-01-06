const GoogleOAuthService = require('./GoogleOAuthService');
const user_db = require('../backend/db');

const googleAuth = new GoogleOAuthService({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

const dbGet = (sql, params) => new Promise((resolve, reject) => {
    user_db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});
const dbRun = (sql, params) => new Promise((resolve, reject) => {
    user_db.run(sql, params, function(err) { err ? reject(err) : resolve(this); });
});

async function authRoutes(fastify, options) {
  fastify.get('/google', async (req, reply) => {
    return reply.redirect(googleAuth.getConsentUrl());
  });

  fastify.get('/google/callback', async (req, reply) => {
    try {
      const { code } = req.query;
      const tokens = await googleAuth.getTokens(code);
      const gUser = await googleAuth.getUserInfo(tokens.access_token);

      let user = await dbGet('SELECT * FROM users WHERE email = ?', [gUser.email]);
      if (!user) {
        const tempName = gUser.name.replace(/\s/g, '') + Math.floor(Math.random() * 100);
        await dbRun('INSERT INTO users (username, email, wins, total_games) VALUES (?, ?, 0, 0)', 
          [tempName, gUser.email]);
        user = await dbGet('SELECT * FROM users WHERE email = ?', [gUser.email]);
      }

      req.session.user = { id: user.id || user.rowid, username: user.username };
      return reply.redirect('http://localhost:5173'); 
    } catch (err) {
      return reply.code(500).send("OAuth Fehler");
    }
  });

  fastify.get('/me', async (req, reply) => {
    if (!req.session || !req.session.user) return { loggedIn: false };
    return { loggedIn: true, user: req.session.user };
  });

  fastify.post('/logout', async (req, reply) => {
    await req.session.destroy();
    return { success: true };
  });
}

module.exports = authRoutes;