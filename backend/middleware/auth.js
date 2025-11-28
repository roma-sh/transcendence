const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * JWT Authentication middleware for Fastify
 * Use as a preHandler hook on routes that require authentication
 */
async function authenticate(request, reply) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return reply.code(401).send({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return reply.code(401).send({ error: 'Invalid or expired token' });
    }

    // Attach user info to request for use in route handlers
    request.user = decoded;
  } catch (err) {
    console.error('Auth middleware error:', err);
    return reply.code(401).send({ error: 'Authentication failed' });
  }
}

module.exports = authenticate;

