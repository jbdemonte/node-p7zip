# Node p7zip

[![travis build](https://img.shields.io/travis/jbdemonte/node-p7zip.svg)](https://travis-ci.org/jbdemonte/node-p7zip)
[![Coverage Status](https://coveralls.io/repos/github/jbdemonte/node-p7zip/badge.svg?branch=master)](https://coveralls.io/github/jbdemonte/node-p7zip?branch=master)
![node (tag)](https://img.shields.io/node/v/p7zip/latest.svg)

## Description

Use `p7zip` directly in JavaScript or TypeScript.  

You do not need to install anything by your own.  

During the installation process, the latest version of [p7zip](https://github.com/jbdemonte/p7zip) is compiled to be used.

## Limitation

Because p7zip is a portage of 7-zip for linux systems, this package is not usable on Windows.

## Installation

```
npm install --save p7zip
```
or
```
yarn add p7zip
```


## Usage

```
import * as p7zip from 'p7zip';


const count = await p7zip.add('test.7z', '*.js');
console.log('File added: ', count);

const content = await p7zip.read('test.7z');
console.log('Path: ', content.path);
console.log('Type: ', content.type);
console.log('Method: ', content.method);

for (const file of data.files) {
  console.log(file.name, file.date);
}

await p7zip.extract('test.7z', './tmp')
```


## Methods

### p7zip.add

**Arguments**
 * `archive` The archive path.
 * `files` The file list to add (string or array of string).
 * `switches` Switches (string or array of string).

**Returns**
 * `count` The file count added.


### p7zip.extract

Default overwrite mode is set to "Overwrite All existing files without prompt" using switch `-aoa`.

**Arguments**
 * `archive` The archive path.
 * `destination` The extraction path (optional).
 * `fileFilter` File filters to extract (string or array of string, optional).
 * `switches` Switches (string or array of string).
 * `full` Extract with full paths (optional, default=true).

**Returns**
 * none


### p7zip.read

**Arguments**
 * `archive` The archive path.
 * `switches` Switches (string or array of string).

**Returns**
 * `data`           Archive

 * `data.path`          string
 * `data.type`          string
 * `data.physicalSize`  number
 * `data.headersSize`   number
 * `data.method`        string
 * `data.solid`         string
 * `data.blocks`        number
 * `data.directories`   array of Entry
 * `data.files`         array of Entry

with Entry:
 * `data.files[].attr`          string
 * `data.files[].compressed`    number
 * `data.files[].date`          date
 * `data.files[].name`          number
 * `data.files[].size`          number


### p7zip.remove

**Arguments**
 * `archive` The archive path.
 * `files` The file list to delete (string or array of string).
 * `switches` Switches (string or array of string).

**Returns**
 * none


### p7zip.rename

**Arguments**
 * `archive` The archive path.
 * `oldName` The original name
 * `newName` The replacement name
 * `switches` Switches (string or array of string).

**Returns**
 * none


### p7zip.update

**Arguments**
 * `archive` Path to the archive.
 * `files` The file list to update (string or array of string).
 * `switches` Switches (string or array of string).

**Returns**
 * `count` The file count updated.
