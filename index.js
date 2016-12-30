var tools = require('./lib/tools');

var exports = module.exports = {};

function load(name) {
  var module = require('./lib/' + name);
  return function () {
    var callback, promise;
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    }
    promise = module.apply(this, args);
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
}

Object.defineProperty(exports, 'Promise', {
  get: function () {
    return tools.Promise;
  },
  set: function (cls) {
    tools.Promise = cls;
  }
});

['add', 'delete', 'extract', 'list', 'rename', 'update'].forEach(function (name) {
  exports[name] = load(name);
});