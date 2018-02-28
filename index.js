var tools = require('./lib/tools');

exports.add = require('./lib/add');
exports.delete = require('./lib/delete');
exports.extract = require('./lib/extract');
exports.list = require('./lib/list');
exports.rename = require('./lib/rename');
exports.update = require('./lib/update');


['add', 'delete', 'extract', 'list', 'rename', 'update'].forEach(function (name) {
  exports[name] = tools.cb_decorate(exports[name]);
});


Object.defineProperty(exports, 'Promise', {
  get: function () {
    return tools.Promise;
  },
  set: function (cls) {
    tools.Promise = cls;
  }
});