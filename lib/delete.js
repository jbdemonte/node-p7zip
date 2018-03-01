const tools = require('./tools');

/**
 * Deletes files from archive
 * @param {string} archive
 * @param {string|string[]} files
 * @param {string|string[]} [switches]
 * @return {Promise}
 */
module.exports = (archive, files, switches) => {
  const args = ['d'].concat(switches || [], archive, files);

  return tools
    .run(args)
    .then(tools.nop);
};
