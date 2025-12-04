const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyCors = require('@fastify/cors');
const path = require('path');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');

const app = Fastify({ logger: true });

app.register(fastifyCors, {
    origin: true, // reflect the request origin (required when credentials: true)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
    credentials: true // important for cookies
});

app.register(fastifyCookie);
app.register(fastifySession, {
    secret: 'NoOneKnowThisSecretKeyNoOneKnowThisSecretKeyNoOneKnowThisSecretKeyNoOneKnowThisSecretKey',
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    },
    saveUninitialized: false
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

app.register(require('./src/routes/auth.routes'), { prefix: '/api/auth' });
app.register(require('./src/routes/alias.routes'), { prefix: '/api/alias' });
app.register(require('./src/routes/stats.routes'), { prefix: '/api/stats' });
app.register(require('./src/routes/profile.route'), { prefix: '/api' });


app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});

// To-do:
// sign out all the users when the server is down.
