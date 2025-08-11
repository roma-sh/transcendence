const Fastify = require('fastify');
const path = require('path');
const fastifyStatic = require('@fastify/static');
// const user_db = require('./user_db');


// Register route files
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');

const app = Fastify({ logger: true });

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