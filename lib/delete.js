var tools = require('./tools');

/**
 * Deletes files from archive
 * @param {string} archive
 * @param {string|string[]} files
 * @return {Promise}
 */
module.exports = function (archive, files) {
  return tools
    .run(['d', archive].concat(files))
    .then(function () {});
};