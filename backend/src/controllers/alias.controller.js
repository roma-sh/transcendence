const AliasService = require('../services/alias.service');

async function checkAlias(request, reply) {
  try {
    const alias = request.params.alias;
    const exists = await AliasService.checkAliasExists(alias);
    reply.send({ exists });
  } catch (err) {
    reply.code(500).send({ error: 'Database error' });
  }
}

module.exports = { checkAlias };
