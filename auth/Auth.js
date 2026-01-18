const GoogleOAuthService = require('./GoogleOAuthService');
const user_db = require('../backend/src/db/db');

const googleAuth = new GoogleOAuthService({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URL
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
    console.log("1. getting token...");
    const tokens = await googleAuth.getTokens(code);
    
    console.log("2. got Token getting user informations...");
    const gUser = await googleAuth.getUserInfo(tokens.access_token);
    console.log("Google user:", gUser.email);

    let user = await dbGet('SELECT * FROM users WHERE email = ?', [gUser.email]);
    
    if (!user) {
      console.log("4. User doesnt exist, creating...");
      const tempName = gUser.name.replace(/\s/g, '') + Math.floor(Math.random() * 100);
      const dummyPass = "OAUTH_" + Math.random().toString(36).slice(-8);

      const result = await dbRun(
        'INSERT INTO users (username, email, password, wins, total_games) VALUES (?, ?, ?, 0, 0)', 
        [tempName, gUser.email, dummyPass]
      );
      
      user = await dbGet('SELECT * FROM users WHERE email = ?', [gUser.email]);
      console.log("5. User successfull created:", user.username);
    } else {
      console.log("4. User found:", user.username);
    }

    req.session.user = { 
      id: user.id, 
      username: user.username,
      email: user.email 
    };
    
    console.log("6. Setting session for:", req.session.user.username);

    return reply.redirect('https://localhost:8443/'); 
    
  } catch (err) {
    console.error("Critical error in Callback:", err);
    return reply.code(500).send("Login Error: " + err.message);
  }
});

fastify.get('/me', async (req, reply) => {
  if (!req.session || !req.session.user) {
    return reply.code(401).send({ loggedIn: false });
  }
  return { loggedIn: true, user: req.session.user };
});

  fastify.post('/logout', async (req, reply) => {
    await req.session.destroy();
    return { success: true };
  });
}

module.exports = authRoutes;