var version = '16.02';
var url = 'https://github.com/jbdemonte/p7zip/archive/';

var decompress = require('decompress');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

wget(url + version + '.zip')
  .then(function () {
    console.log('Decompress ' + version + '.zip');
    return decompress(version + '.zip', 'build');
  })
  .then(function () {
    return new Promise(function (resolve, reject) {

      var make = spawn('make', {cwd: 'build/p7zip-' + version});


      make.stdout.on('data', function (data) {
        console.log(data.toString());
      });

      make.stderr.on('data', function (data) {
        console.error(data.toString());
      });

      make.on('exit', function (code) {
        if (code) {
          console.error('make exited with code ' + code.toString());
          console.log('resolve the problem and re-build it using:');
          console.log('npm install');
          return reject();
        }
        resolve();
      });

    });
  })
  .then(function () {
    return mkdir('bin');
  })
  .then(function () {
    return rename('build/p7zip-' + version + '/bin/7za', 'bin/7za');
  })
  .then(function () {
    fs.unlinkSync(version + '.zip');
    rmdir('build');
  })
  .catch(function (err) {
    console.log(err);
  });


function wget(path) {
  console.log('Downloading ' + path);
  return new Promise(function (resolve, reject) {
    require('node-wget')(path, function (err) {
      if (err) {
        console.error('Error downloading file: ');
        console.error(err);
        return reject();
      }
      resolve();
    });
  });
}

function mkdir(path) {
  return new Promise(function (resolve, reject) {
    fs.mkdir(path, function (err) {
      if (err) {
        return reject();
      }
      resolve();
    });
  });
}

function rename(oldPath, newPath) {
  return new Promise(function (resolve, reject) {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        return reject();
      }
      resolve();
    });
  });
}

function rmdir(dir) {
  var filename, i, item, len, list, stat;
  list = fs.readdirSync(dir);
  for (i = 0, len = list.length; i < len; i++) {
    item = list[i];
    filename = path.join(dir, item);
    stat = fs.statSync(filename);
    if (filename === "." || filename === "..") {

    } else if (stat.isDirectory()) {
      rmdir(filename);
    } else {
      fs.unlinkSync(filename);
    }
  }
  return fs.rmdirSync(dir);
}