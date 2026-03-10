const AliasService = require('../services/alias.service');

async function checkAlias(request, reply) {
  try {
    const alias = request.params.alias;
    const exists = await AliasService.checkAliasExists(alias);
    reply.send({ success: true, exists });
  } catch (err) {
    reply.send({ success: false, error: 'Database error' });
  }
}

module.exports = { checkAlias };
