var tools = require('./tools');

/**
 * Adds files to archive
 * @param {string} archive
 * @param {string|string[]} files
 * @param {string[]} [switches]
 * @return {Promise}
 */
module.exports = function (archive, files, switches) {

  var args = ['a', archive].concat(files);

  if (switches) {
    args = args.concat(switches);
  }

  return tools
    .run(args)
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