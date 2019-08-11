import { run } from './binary';

const properties: string[] = ['Path', 'Type', 'Physical Size', 'Headers Size', 'Method', 'Solid', 'Blocks'];
const boundary = /^-----------*[\s-]+$/;

function camelCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((part, index) => (index ? part[0].toUpperCase() + part.substr(1) : part))
    .join('');
}

export class Archive {
  path: string;
  type: string;
  physicalSize: number;
  headersSize: number;
  method: string;
  solid: string;
  blocks: number;
  directories: Entry[];
  files: Entry[];

  constructor() {
    this.path = '';
    this.type = '';
    this.physicalSize = 0;
    this.headersSize = 0;
    this.method = '';
    this.solid = '';
    this.blocks = 0;
    this.directories = [];
    this.files = [];
  }
}

export class Entry {
  attr: string;
  date: Date | null;
  name: string;
  size: number;
  compressed: number;

  constructor() {
    this.attr = '';
    this.date = null;
    this.name = '';
    this.size = 0;
    this.compressed = 0;
  }
}

/**
 * List content of archive
 * @param {string} archive
 * @param {string|string[]} [switches]
 * @return {Promise}
 */
export async function read(archive: string, switches?: string | string[]): Promise<Archive> {
  const args: string[] = ['l'].concat(switches || [], archive);

  const lines = await run(args);
  const info = new Archive();
  let listing = false;

  for (const line of lines) {
    if (boundary.exec(line)) {
      listing = !listing;
      if (listing) {
        continue;
      }
    }

    if (listing) {
      const entry = new Entry();
      entry.date = new Date(line.substr(0, 19));
      entry.attr = line.substr(20, 5);
      entry.size = parseInt(line.substr(26, 12), 10) || 0;
      entry.compressed = parseInt(line.substr(39, 12), 10) || 0;
      entry.name = line.substr(53);

      if (entry.attr.indexOf('D') >= 0) {
        info.directories.push(entry);
      } else {
        info.files.push(entry);
      }
    } else {
      properties.some(property => {
        if (line.startsWith(`${property} = `)) {
          let value: string | number = line.substr(property.length + 3);
          const key = camelCase(property);
          if (['physicalSize', 'headersSize', 'blocks'].includes(key)) {
            value = parseInt(value, 10);
          }
          // @ts-ignore - todo find a way to ensure typing here avoiding code duplication
          info[key] = value;
          return true;
        }
        return false;
      });
    }
  }

  return info;
}
