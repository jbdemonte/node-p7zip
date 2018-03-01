const tools = require('./tools');

/**
 * Adds files to archive
 * @param {string} archive
 * @param {string|string[]} files
 * @param {string|string[]} [switches]
 * @return {Promise}
 */
module.exports = (archive, files, switches) => {
  const args = ['a'].concat(switches || [], archive, files);

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
