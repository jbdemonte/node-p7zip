const spaw = require('child_process').spawn;
const path = require('path');

const bin = path.resolve(path.join(__dirname, '..', 'bin', '7za'));

exports.Promise = Promise;

exports.nop = () => undefined;

/**
 * Return true if the haystack starts with the needle
 * @param {string} haystack
 * @param {string} needle
 * @return {boolean}
 */
exports.start = (haystack, needle) => haystack.substr(0, needle.length) === needle;

/**
 * Run 7za using arguments, arguments may be inline or in an array
 * @param {any[]} args
 * @return {Promise<string[]>}
 */
exports.run = args => new exports.Promise((resolve, reject) => {
  const cmd = spaw(bin, args);
  let out = '';

  cmd.stdout.on('data', (lines) => { out += lines.toString(); });

  cmd.stderr.on('data', exports.nop);

  cmd.on('close', (code) => {
    if (code) {
      reject(new Error(`Command exit with code ${code}`));
    } else {
      resolve(out.replace(/\r/g, '').split(/\n/));
    }
  });
});

/**
 *
 * Append the support of the callback usage to a promised function
 * @param {Function} fn
 * @return {Promise|null}
 */
exports.cb_decorate = fn => (...args) => {
  let callback;
  if (typeof args[args.length - 1] === 'function') {
    callback = args.pop();
  }
  const promise = fn.apply(this, args);
  if (callback) {
    promise
      .then(result => callback(null, result))
      .catch(err => callback(err));
    return null;
  }
  return promise;
};
