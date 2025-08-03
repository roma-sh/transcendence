// require is the function to call the libraries "modules" we
// want to use
// fastify is a web frame from node.js
// path used to wprk with files path
// sqlite3 for database
// @fastify/static is a plugin that lets Fastify serve static files (like index.html)

const Fastify = require('fastify');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fastifyStatic = require('@fastify/static');

// Create Fastify app
// logger to print useful messages while running the server
const fastify = Fastify({ logger: true });

// Serve static HTML from /public
// to tell fastify where are the files which will be used when 
// someone open the website
// we used path.join better than writing a plain path
// we can write the first line as:
// fastify.register(require('@fastify/static'), {
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/', 
});

// fastify.get('/', async (request, reply) => {
//   return reply.redirect('#welcome-page');
// });


// Create (or open) the SQLite database
const user_db = new sqlite3.Database('./database/user_db.db');

// Create table if not exists
// The table will store:
// id: a number that increases automatically (unique for each row).
// name: a text field to store the user's name.
user_db.run(`CREATE TABLE IF NOT EXISTS names (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT
)`);

// Route to handle POST /submit
/*
This creates a POST route at /submit.
It means: when someone sends data to /submit, this function will run.
request.body contains the data the user sent from the frontend.
We extract name from the body using { name } = request.body
*/
// in front end when we want to send data we must use fetch()
// which require:
// the route to know where to send data in the app '/submit'
// and the merhod which is 'POST' in this case
// we use 'async' so we can wait for another process to be done
// like waiting the data to be writin in the database
// fastify.post('/submit',
//     async (request, reply) =>
//     {
//         const { name } = request.body; // body is the JSON data sent from the frontend using fetch()
//         if (!name)
//         {
//             return reply.code(400).send({ error: 'Name is required' });
//         }
//         // where this message is sent to??

//         // This inserts the name into the database
//         // The ? is a placeholder to safely insert values — it helps protect against bad input (security)
//         // [name] is the actual value we insert into the ?
//         db.run(`INSERT INTO names(name) VALUES(?)`, [name],
//             function (err)
//             {
//                 if (err)
//                 {
//                     reply.code(500).send({ error: 'DB error' });
//                 }
//                 else
//                 { // where these "send" go to?
//                     reply.send({ success: true });
//                 }
//             });
// });

// Start server
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Our server listening at ${address}`);
});
