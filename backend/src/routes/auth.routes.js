// import the file "auth.controller.js" and the functions from it
// so we assign each route to its controller function
// we can import all the functions at once using destructuring
// but don't need to import the entire file as an object

const { signupController, loginController, logoutController } = require('../controllers/auth.controller');
const { profileController } = require('../controllers/profile.controller'); // to delete

async function authRoutes(fastify) {
  fastify.post('/signup', signupController);
  fastify.post('/login', loginController);
  fastify.post('/logout', logoutController);
}

// if another file wants to require this file to use the routes, we export the function
// something like returning the authRoutes function when another file requires this one.
module.exports = authRoutes;
