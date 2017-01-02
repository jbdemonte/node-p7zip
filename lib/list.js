var tools = require('./tools');

var properties = ['Path', 'Type', 'Physical Size', 'Headers Size', 'Method', 'Solid', 'Blocks'];
var regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) ([\.D][\.R][\.H][\.S][\.A]) +(\d+) +(\d+)? +(.+)/;

function camelCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(function (part, index) {
      return index ? part[0].toUpperCase() + part.substr(1) : part;
    })
    .join('');
}

function ArchiveInfo() {
  this.path = undefined;
  this.type = undefined;
  this.physicalSize = undefined;
  this.headersSize = undefined;
  this.method = undefined;
  this.solid = undefined;
  this.blocks = undefined;
  this.directories = [];
  this.files = [];
}

function ArchiveEntry() {
  this.attr = undefined;
  this.compressed = undefined;
  this.date = undefined;
  this.name = undefined;
  this.size = undefined;
}

/**
 * List contents of archive
 * @param {string} archive
 * @param {string[]} [switches]
 * @return {Promise}
 */
module.exports = function (archive, switches) {

  var args = ['l', archive];

  if (switches) {
    args = args.concat(switches);
  }
  return tools
    .run(args)
    .then(function (lines) {

      var info = new ArchiveInfo();

      lines.forEach(function (line) {
        var res = regex.exec(line);
        if (res) {
          var entry = new ArchiveEntry();
          entry.date = new Date(res[1]);
          entry.attr = res[2];
          entry.size = parseInt(res[3], 10) || 0;
          entry.compressed = parseInt(res[4]) || 0;
          entry.name = res[5];

          if (~(entry.attr || '').indexOf('D')) {
            info.directories.push(entry);
          } else {
            info.files.push(entry);
          }

        } else {
          properties.some(function (property) {
            if (tools.start(line, property + ' = ')) {
              info[camelCase(property)] = line.substr(property.length + 3);
            }
          });
        }
      });

      ['physicalSize', 'headersSize', 'blocks'].forEach(function (property) {
        if (info[property]) {
          info[property] = parseInt(info[property], 10);
        }
      });

      return info;
    });
};