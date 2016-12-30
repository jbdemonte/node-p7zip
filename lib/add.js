var tools = require('./tools');

/**
 * Adds files to archive
 * @param {string} archive
 * @param {string|string[]} files
 * @return {Promise}
 */
module.exports = function (archive, files) {
  return tools
    .run(['a', archive].concat(files))
    .then(function (lines) {

      var needle = 'Items to compress: ';
      var count = 0;

      lines.some(function (line) {
        if (tools.start(line, needle)) {
          count = parseInt(line.substr(needle.length).trim(), 10);
        }
      });

      return count;
    });
};