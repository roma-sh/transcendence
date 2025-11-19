const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');
const fastifyCors = require('@fastify/cors');
const path = require('path');
const cookie = require('@fastify/cookie');
const session = require('@fastify/session');

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
    cookie: { secure: false },   // true if HTTPS
    saveUninitialized: false
});

app.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/',
});

app.register(require('./src/routes/auth.routes'), { prefix: '/api/auth' });
app.register(require('./src/routes/alias.routes'), { prefix: '/api/alias' });
app.register(require('./src/routes/stats.routes'), { prefix: '/api/stats' });
app.register(require('./src/routes/profile.routes'), { prefix: '/api' });

app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
