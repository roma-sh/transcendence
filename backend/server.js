require('dotenv').config();
const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyCors = require('@fastify/cors');
const path = require('path');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');
const fastifyMultipart = require('@fastify/multipart');
const fastifyRateLimit = require('@fastify/rate-limit');
const authRoutes = require("../auth/Auth");
const apiKeyHook = require('./src/utils/apiKey');

const app = Fastify({ logger:
  {
    level: process.env.NODE_ENV === 'production' ? 'error' : 'warn'
  },
  trustProxy: true,
});

app.register(fastifyCors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'x-api-key'],
    credentials: true // important for cookies
});

app.register(fastifyCookie);
app.register(fastifySession, {
    secret: process.env.SESSION_SECRET,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    },
    saveUninitialized: false
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

const frontendRoot = path.join(__dirname, '../frontend');
const uploadsRoot = path.join(__dirname, '../public/uploads');

app.register(fastifyStatic, {
  root: uploadsRoot,
  prefix: '/uploads/',
  decorateReply: false,
});

app.register(fastifyStatic, {
  root: frontendRoot,
  prefix: '/',
  index: 'pong.html',
  decorateReply: false,
});

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

app.addHook('onRequest', (request, reply, done) => {
  if (request.url.startsWith('/api')) {
    return apiKeyHook(request, reply, done);
  }
  done();
});

// Serve API key to the frontend at runtime (never committed to source)
app.get('/config.js', (request, reply) => {
  const apiKey = process.env.API_KEY || '';
  reply
    .header('Content-Type', 'application/javascript')
    .header('Cache-Control', 'no-store')
    .send(`window.__API_KEY__ = ${JSON.stringify(apiKey)};`);
});

app.register(require('./src/routes/auth.routes'), { prefix: '/api/auth' });
app.register(require('./src/routes/alias.routes'), { prefix: '/api/alias' });
app.register(require('./src/routes/profile.route'), { prefix: '/api' });
app.register(require('./src/routes/game.route'), { prefix: '/api/game' });
app.register(authRoutes, { prefix: '/api' });


const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

app.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});

// To-do:
// sign out all the users when the server is down.
