var tools = require('./tools');

/**
 * Renames files in archive
 * @param {string} archive
 * @param {object} files - hashmap {oldName => newName}
 * @param {string[]} [switches]
 * @return {Promise}
 */
module.exports = function (archive, files, switches) {
  var args = ['rn', archive];

  Object.keys(files).forEach(function (source) {
    args.push(source);
    args.push(files[source]);
  });

  if (switches) {
    args = args.concat(switches);
  }

  return tools
    .run(args)
    .then(function () {});
};