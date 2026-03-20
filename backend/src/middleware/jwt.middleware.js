const { verifyToken } = require('../services/jwt.service');

async function jwtAuth(request, reply) {
  const authHeader = request.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token && request.session && request.session.userId) {
    return;
  }

  if (!token) {
    return reply.send({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    request.user = decoded;
    request.userId = decoded.id;
  } catch (err) {
    return reply.send({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = { jwtAuth };
