var tools = require('./tools');

/**
 * Extracts files from an archive to a directory
 * @param {string} archive
 * @param {string} [destination]
 * @param {string|string[]} [fileFilter] - if set to a string, destination has to be set (even if equals '')
 * @param {boolean} [full=false] Extract with full paths
 * @return {Promise}
 */
module.exports = function (archive, destination, fileFilter, full) {
  if (typeof destination === 'boolean') {
    full = destination;
    destination = fileFilter = undefined;
  }
  if (typeof fileFilter === 'boolean') {
    full = fileFilter;
    fileFilter = undefined;
  }
  if (Array.isArray(destination)) {
    fileFilter = destination;
    destination = undefined;
  }
  var args = [full ? 'x' : 'e', archive];
  if (destination) {
    args.push('-o' + destination);
  }
  if (fileFilter) {
    args = args.concat(fileFilter);
  }
  return tools
    .run(args)
    .then(function () {});
};