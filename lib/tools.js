var spaw = require('child_process').spawn;
var path = require('path');

var bin = path.resolve(path.join(__dirname, '..', 'bin', '7za'));

exports.Promise = Promise;

/**
 * Return true if the haystack starts with the needle
 * @param {string} haystack
 * @param {string} needle
 * @return {boolean}
 */
exports.start = function (haystack , needle) {
  return haystack.substr(0, needle.length) === needle;
};

/**
 * Run 7za using arguments, arguments may be inline or in an array
 */
exports.run = function () {
  var args = Array.prototype.slice.call(arguments);

  if (Array.isArray(args[0])) {
    args = args[0];
  }

  return new exports.Promise(function (resolve, reject) {
    var cmd = spaw(bin, args);
    var out = '';

    cmd.stdout.on('data', function (lines) {
      out += lines.toString();
    });

    cmd.stderr.on('data', function (lines) {
      // flush buffer
    });

    cmd.on('close', function (code) {
      if (code) {
        return reject(new Error('Command exit with code ' + code));
      }
      resolve(out.replace(/\r/g, '').split(/\n/));
    });
  });
};

/**
 * Append the support of the callback usage to a promised function
 * @param {Function} fn
 * @return {Function}
 */
exports.cb_decorate = function (fn) {
  return function () {
    var callback, promise;
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    }
    promise = fn.apply(this, args);
    if (callback) {
      promise
        .then(function (result) {
          callback(null, result);
        })
        .catch(function (err) {
          callback(err);
        });
    } else {
      return promise;
    }
  };
};