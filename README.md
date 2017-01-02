Node p7zip wrapper
==================

A node wrapper for 7z including the latest version of `7za`.

Description
-----------

During the installation process, the latest version of [p7zip](https://github.com/jbdemonte/p7zip) is compiled to be used.
This module handle both callback and promise syntax.

Installation
------------

```
npm install --save p7zip
```


Usage
-----
```
var p7zip = require('p7zip');

p7zip
  .add('test.7z', '*.js')
  .then(function (count) {
    console.log('File added: ', count);
  })
  .list('test.7z')
  .then(function (data) {
    console.log('Path: ', data.path);
    console.log('Type: ', data.type);
    console.log('Method: ', data.method);

    data.files.forEach(function (file, index) {
      console.log('\nFile #' + (index + 1));
      console.log(file.name);
      console.log(file.date);
    });
  })
  .catch(function (err) {
    console.log(err);
  });
```

Promise library use node Promise, but may be replaced:

```
var p7zip = require('p7zip');

p7zip.Promise = require('bluebird');
```


API
---

### p7zip.add

**Arguments**
 * `archive` The archive path.
 * `files` The file list to add (string or array of string).
 * `switches` Switches (array of string).

**Returns**
 * `count` The file count added.


### p7zip.delete

**Arguments**
 * `archive` The archive path.
 * `files` The file list to delete (string or array of string).
 * `switches` Switches (array of string).

**Returns**
 * none


### p7zip.extract

Default overwrite mode is set to "Overwrite All existing files without prompt" using switch `-aoa`.

**Arguments**
 * `archive` The archive path.
 * `destination` The extraction path (optional).
 * `fileFilter` File filters to extract (string or array of string, optional).
 * `switches` Switches (array of string).
 * `full` Extract with full paths (optional, default=true).

**Returns**
 * none


### p7zip.list

**Arguments**
 * `archive` The archive path.
 * `switches` Switches (array of string).

**Returns**
 * `data`           object

 * `data.path`          string
 * `data.type`          string
 * `data.physicalSize`  number
 * `data.headersSize`   number
 * `data.method`        string
 * `data.solid`         string
 * `data.blocks`        number
 * `data.directories`   array (same as `data.files`)
 * `data.files`         array

 * `data.files[].attr`          string
 * `data.files[].compressed`    number
 * `data.files[].date`          date
 * `data.files[].name`          number
 * `data.files[].size`          number


### p7zip.rename

**Arguments**
 * `archive` The archive path.
 * `files` Hashmap of the file list to rename ({oldName: newName, ...}.
 * `switches` Switches (array of string).

**Returns**
 * none

### p7zip.update

**Arguments**
 * `archive` Path to the archive.
 * `files` The file list to update (string or array of string).
 * `switches` Switches (array of string).

**Returns**
 * `count` The file count updated.
