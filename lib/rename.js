const tools = require('./tools');

/**
 * Renames files in archive
 * @param {string} archive
 * @param {object} files - hashmap {oldName => newName}
 * @param {string|string[]} [switches]
 * @return {Promise}
 */
module.exports = function (archive, files, switches) {
  const args = ['rn'].concat(switches || [], archive);

  Object.keys(files).forEach((source) => {
    args.push(source);
    args.push(files[source]);
  });

  return tools
    .run(args)
    .then(tools.nop);
};
