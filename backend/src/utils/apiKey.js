const EXCLUDED_PATHS = ['/api/google', '/api/google/callback'];

function apiKeyHook(request, reply, done) {
  if (EXCLUDED_PATHS.includes(request.url.split('?')[0])) {
    return done();
  }

  const clientKey = request.headers['x-api-key'];
  const serverKey = process.env.API_KEY;

  if (!serverKey) {
    request.log.error('API_KEY is not set in environment variables');
    reply.code(500).send({ error: 'Server misconfiguration' });
    return;
  }

  if (!clientKey || clientKey !== serverKey) {
    reply.code(403).send({ error: 'Forbidden: invalid API key' });
    return;
  }

  done();
}

module.exports = apiKeyHook;
