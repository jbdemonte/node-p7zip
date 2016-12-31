var tools = require('./tools');

/**
 * Extracts files from an archive to a directory
 * @param {string} archive
 * @param {string} [destination]
 * @param {string|string[]} [fileFilter] - if set to a string, destination has to be set (even if equals '')
 * @param {string[]} [switches]
 * @param {boolean} [full=true] Extract with full paths
 * @return {Promise}
 */
module.exports = function (archive, destination, fileFilter, switches, full) {
  if (typeof destination === 'boolean') {
    full = destination;
    destination = fileFilter = switches = undefined;
  }
  if (typeof fileFilter === 'boolean') {
    full = fileFilter;
    fileFilter = switches = undefined;
  }
  if (typeof switches === 'boolean') {
    full = switches;
    switches = undefined;
  }
  if (Array.isArray(destination)) {
    fileFilter = destination;
    destination = undefined;
  }

  // Basically, fileFilter and switches are used the same way, so, no need to
  // try to distinguish them (user can use only one array)

  var args = [full !== false ? 'x' : 'e', archive];
  if (destination) {
    args.push('-o' + destination);
  }
  if (fileFilter) {
    args = args.concat(fileFilter);
  }
  if (switches) {
    args = args.concat(switches);
  }

  // No overwrite mode preset
  if (!~args.indexOf('-aoa') && !~args.indexOf('-aos') && !~args.indexOf('-aou') && !~args.indexOf('-aot')) {
    args.push('-aoa'); // Overwrite All existing files without prompt
  }

  return tools
    .run(args)
    .then(function () {});
};