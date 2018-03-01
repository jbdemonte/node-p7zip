const tools = require('./tools');

/**
 * Adds files in an archive
 * @param {string} archive
 * @param {string|string[]} files
 * @param {string[]} [switches]
 * @return {Promise}
 */
module.exports = function (archive, files, switches) {
  let args = ['u', archive].concat(files);

  if (switches) {
    args = args.concat(switches);
  }

  return tools
    .run(args)
    .then((lines) => {
      const needle = 'Items to compress: ';
      let count = 0;

      lines.some((line) => {
        const found = tools.start(line, needle);
        if (found) {
          count = parseInt(line.substr(needle.length).trim(), 10);
        }
        return found;
      });

      return count;
    });
};
