const tools = require('./tools');

/**
 * Deletes files from archive
 * @param {string} archive
 * @param {string|string[]} files
 * @param {string[]} [switches]
 * @return {Promise}
 */
module.exports = (archive, files, switches) => {
  let args = ['d', archive].concat(files);

  if (switches) {
    args = args.concat(switches);
  }

  return tools
    .run(args)
    .then(tools.nop);
};
