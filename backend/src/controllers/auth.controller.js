// import the file "auth.service.js" from services folder
// to use its functions here
const { insertUser, getUser } = require('../services/auth.service');
const { setUserOnline } = require('../services/profile.service');
const { isValidEmail, isStrongPassword, isValidUsername } = require('../utils/validators');

// when the browser sends a signup request, this controller handles it
// request: contains the data sent by the client (browser)
// reply: used to send back a response to the client
// async function signupController(request, reply) {
//   const { username, email, password } = request.body;

//   if (!username || !email || !password) {
//     return reply.code(400).send({ error: 'All fields are required' });
//     // how the frontend will know that there was an error?
//     // by checking the HTTP status code (400 means bad request)
//     // and the error message in the response body
//     // frontend can show this message to the user
//   }

//   try {
//     // try to insert the new user into the database, using the service function from auth.service.js
//     const userId = await insertUser(username, email, password);
//     return reply.send({ success: true, userId });
//   } catch (err) {
//     if (err.message.includes('UNIQUE constraint failed')) {
//       return reply.code(409).send({ error: 'Email already exists' });
//     }
//     return reply.code(500).send({ error: 'Server error', details: err.message });
//   }
// }



// ################################################


// async function loginController(request, reply) {
//   const { username, password } = request.body;

//   try {
//     const user = await getUser(username, password);
//     if (!user) {
//       return reply.code(401).send({ message: 'Invalid credentials' });
//     }

//     // in Server.js, we set up session management
//     // here we store the user ID in the session
//     // at the beginning of the session, it's empty like: session = {}
//     // after login, it becomes: session = { userId: 123 }
//     // and each seasion create a cookie in the browser which has a unique session ID or Key
//     // this cookie is sent with each request from the browser to the server
//     // so the server can know which session is it "which browser"
//     // and retrieve the userId from the session so we know who is the user now
//     request.session.userId = user.id;

//     // Send back the user info as JSON
//     return reply.send({ user: { id: user.id, username: user.username, email: user.email } });
//   } catch (err) {
//     console.error('Login error:', err);
//     return reply.code(500).send({ message: 'Server error' });
//   }
// }

// // ################################################

// async function logoutController(request, reply) {
//   // Destroy session
//   await request.session.destroy();
//   return reply.send({ message: 'Logged out successfully' });
// }


// // ################################################


// // async function profileController(request, reply) {
// //   const userId = request.session.userId;
// //   if (!userId) return reply.code(401).send({ message: 'Not logged in' });

// //   // Fetch user info
// //   const user = await getUserById(userId);
// //   return reply.send({ user });
// // }

// // ################################################


// // Helper to get user by ID


// module.exports = { signupController, loginController, logoutController };


// ...existing code...

async function signupController(request, reply) {
  const { username, email, password } = request.body;

  // Validate required fields
  if (!username || !email || !password) {
    return reply.code(400).send({ error: 'All fields are required' });
  }

  // Validate username
  if (!isValidUsername(username)) {
    return reply.code(400).send({
      error: 'Invalid username. Must be at least 3 characters and contain only letters, numbers, or underscores.'
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return reply.code(400).send({
      error: 'Invalid email format. Please enter a valid email.'
    });
  }

  // Validate password strength
  if (!isStrongPassword(password)) {
    return reply.code(400).send({
      error:
        'Weak password. Must be 8+ characters and include upper & lower case letters, a number, and a special character.'
    });
  }

  try {
    const newId = await insertUser(username, email, password);
    return reply.code(201).send({ message: 'User created', id: newId });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: 'Failed to create user' });
  }
}

async function loginController(request, reply) {
  const { username, password } = request.body; // frontend sends identifier as "username"
  console.log('LOGIN attempt, identifier:', username, 'password:', password);
  if (!username || !password) {
    return reply.code(400).send({ message: 'Missing credentials' });
  }

  try {
    const user = await getUser(username, password);
    console.log('Hiiii DB getUser ->', user);
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }
  // set user.online = 1 in the database
  const updated = await setUserOnline(user.id);

  if (updated === 0) {
    console.warn(`Warning: user ${user.id} found but online status was NOT updated`);
  }

    // set session user id
    request.session.userId = user.id; // users table expected to have `id` column
    console.log('hiii Session after login:', request.session);
    console.log('hiiii User logged in:', { id: user.id, username: user.username, email: user.email });
    // ensure session persisted before replying
    await new Promise((resolve, reject) => {
      if (typeof request.session.save === 'function') {
        request.session.save((err) => (err ? reject(err) : resolve()));
      } else {
        // fastify-session may persist automatically — resolve immediately
        resolve();
      }
    });

    return reply.send({ message: 'Logged in', user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ message: 'Server error' });
  }
}

async function logoutController(request, reply) {
  await request.session.destroy();
  return reply.send({ message: 'Logged out successfully' });
}

module.exports = { signupController, loginController, logoutController };
