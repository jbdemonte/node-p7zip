const version = '16.02';
const url = 'https://github.com/jbdemonte/p7zip/archive/';
const bin = 'bin/7za';

const decompress = require('decompress');
const fs = require('fs');
const path = require('path');
const { get } = require('https');
const spawn = require('child_process').spawn;

/**
 * Download a file an returns its content
 * @return {Promise<Buffer>}
 */
function wget(uri) {
  console.log('Downloading ' + uri);
  return new Promise((resolve, reject) => {
    get(uri, response => {
      const { statusCode, headers } = response;
      if (statusCode === 302) {
        wget(headers.location)
          .then(resolve)
          .catch(reject)
      } else {
        let buffer = Buffer.alloc(0);
        response.on('data', (chunk) => {
          buffer = Buffer.concat([buffer, chunk]);
        });
        response.on('end', () => resolve(buffer));
      }
    }).on('error', reject);
  })
}


/**
 * recursive rmdir
 */
function rmdir(dir) {
  const list = fs.readdirSync(dir);
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];
    const filename = path.join(dir, item);
    const stat = fs.statSync(filename);
    if (filename !== "." && filename !== "..") {
      if (stat.isDirectory()) {
        rmdir(filename);
      } else {
        fs.unlinkSync(filename);
      }
    }
  }
  return fs.rmdirSync(dir);
}

/**
 * Build the binary
 * @return {Promise<void>}
 */
function make(fullPath) {
  return new Promise((resolve, reject) => {
    const make = spawn('make', { cwd: fullPath });

    make.stdout.on('data', data => console.log(data.toString()));
    make.stderr.on('data', data => console.error(data.toString()));

    make.on('error', error => {
      console.log('An error has occurred: ' + error.message);
      console.log('Ensure make is installed - on debian: sudo apt install build-essential');
      reject(error);
    })

    make.on('exit', code => {
      if (code) {
        console.error('make exited with code ' + code.toString());
        console.log('resolve the problem and re-build it using:');
        console.log('npm install');
        return reject();
      }
      resolve();
    });
  });
}

async function main() {
  if (fs.existsSync(bin)) {
    return ;
  }

  const content = await wget(url + version + '.zip');
  console.log('Decompress ' + version + '.zip');

  await decompress(content, 'build');
  await make('build/p7zip-' + version);

  fs.mkdirSync('bin');
  fs.renameSync('build/p7zip-' + version + '/bin/7za', bin);
  rmdir('build');
}

main()
  .then(() => console.log('done'))
  .catch(error => {
    console.log(error.message || error);
    process.exit(1);
  });
