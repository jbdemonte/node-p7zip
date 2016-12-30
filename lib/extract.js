var tools = require('./tools');

/**
 * Extracts files from an archive to a directory
 * @param {string} archive
 * @param {string} [destination]
 * @param {boolean} [full=false] Extract with full paths
 * @return {Promise}
 */
module.exports = function (archive, destination, full) {
  if (typeof destination === 'boolean') {
    full = destination;
    destination = undefined;
  }
  var args = [full ? 'x' : 'e', archive];
  if (destination) {
    args.push('-o' + destination);
  }
  return tools
    .run(args)
    .then(function (lines) {

      var files = [];
      var needle = 'Extracting archive: ';

      lines.forEach(function (line) {
        if (tools.start(line, needle)) {
          files.push(line.substr(needle.length).trim());
        }
      });

      return files;
    });
};