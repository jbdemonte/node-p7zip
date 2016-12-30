var tools = require('./tools');

/**
 * Renames files in archive
 * @param {string} archive
 * @param {object} files - hashmap {oldName => newName}
 * @return {Promise}
 */
module.exports = function (archive, files) {
  var args = ['rn', archive];
  Object.keys(files).forEach(function (source) {
    args.push(source);
    args.push(files[source]);
  });
  return tools
    .run(args)
    .then(function () {});
};