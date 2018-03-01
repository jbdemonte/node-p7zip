const tools = require('./tools');

/**
 * Extracts files from an archive to a directory
 * Params: archive [, destination [, fileFilter [, switches [, full]]]]
 * @param {string} archive
 * @param {string} [destination]
 * @param {string|string[]} [fileFilter]
 * @param {string|string[]} [switches]
 * @param {boolean} [full=true] Extract with full paths
 * @return {Promise}
 */
module.exports = (archive, destination, fileFilter, switches, full) => {
  let args = [full !== false ? 'x' : 'e'];
  if (destination) {
    args.push(`-o${destination}`);
  }
  if (switches) {
    args = args.concat(switches);
  }
  // No overwrite mode preset
  if (args.indexOf('-aoa') < 0 && args.indexOf('-aos') < 0 && args.indexOf('-aou') < 0 && args.indexOf('-aot') < 0) {
    args.push('-aoa'); // Overwrite All existing files without prompt
  }
  args.push(archive);
  if (fileFilter) {
    args = args.concat(fileFilter);
  }

  return tools
    .run(args)
    .then(tools.nop);
};
