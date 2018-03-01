const tools = require('./tools');

const properties = ['Path', 'Type', 'Physical Size', 'Headers Size', 'Method', 'Solid', 'Blocks'];
const boundary = /^-{10,}[\s-]+$/;

function camelCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((part, index) => (index ? part[0].toUpperCase() + part.substr(1) : part))
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
 * @param {string|string[]} [switches]
 * @return {Promise}
 */
module.exports = (archive, switches) => {
  const args = ['l'].concat(switches || [], archive);

  return tools
    .run(args)
    .then((lines) => {
      const info = new ArchiveInfo();
      let listing = false;

      lines.forEach((line) => {
        if (boundary.exec(line)) {
          listing = !listing;
          if (listing) {
            return;
          }
        }

        if (listing) {
          const entry = new ArchiveEntry();
          entry.date = new Date(line.substr(0, 19));
          entry.attr = line.substr(20, 5);
          entry.size = parseInt(line.substr(26, 12), 10) || 0;
          entry.compressed = parseInt(line.substr(39, 12), 10) || 0;
          entry.name = line.substr(53);

          if ((entry.attr || '').indexOf('D') >= 0) {
            info.directories.push(entry);
          } else {
            info.files.push(entry);
          }
        } else {
          properties.some((property) => {
            const found = tools.start(line, `${property} = `);
            if (found) {
              info[camelCase(property)] = line.substr(property.length + 3);
            }
            return found;
          });
        }
      });

      ['physicalSize', 'headersSize', 'blocks'].forEach((property) => {
        if (info[property]) {
          info[property] = parseInt(info[property], 10);
        }
      });

      return info;
    });
};
