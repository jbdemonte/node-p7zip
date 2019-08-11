const version = '16.02';
const url = 'https://github.com/jbdemonte/p7zip/archive/';
const bin = 'bin/7za';

const decompress = require('decompress');
const fs = require('fs');
const path = require('path');
const request = require('request');
const spawn = require('child_process').spawn;

/**
 * Download a file an returns its content
 * @return {Promise<Buffer>}
 */
function wget(uri) {
  console.log('Downloading ' + uri);
  return new Promise((resolve, reject) => {
    request({uri, encoding: null}, (err, { body }) => {
      if (err) {
        console.error('Error downloading file: ');
        console.error(err);
        return reject();
      }
      resolve(body);
    });
  });
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
  .catch(err => {
    console.log(err);
    process.exit(1);
  });