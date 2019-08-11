import { read } from './read';
const tools = require('./binary');

test('simple usage', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await read('archive');
  expect(tools.run).toHaveBeenCalledWith(['l', 'archive']);
});

test('single switch', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await read('archive', '-a');
  expect(tools.run).toHaveBeenCalledWith(['l', '-a', 'archive']);
});

test('multiple switches', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await read('archive', ['-a', '-b']);
  expect(tools.run).toHaveBeenCalledWith(['l', '-a', '-b', 'archive']);
});

test('data extraction', async () => {
  const lines = `
7-Zip (a) [64] 16.02 : Copyright (c) 1999-2016 Igor Pavlov : 2016-05-21
p7zip Version 16.02 (locale=fr_FR.UTF-8,Utf16=on,HugeFiles=on,64 bits,8 CPUs x64)

Scanning the drive for archives:
1 file, 763859 bytes (746 KiB)

Listing archive: Super Baseball.zip

--
Path = /Users/jbd/Super Baseball.zip
Type = zip
Physical Size = 345677654
Headers Size = 87654
Method = xyz
Solid = yes
Blocks = 23


Date      Time    Attr         Size   Compressed  Name
------------------- ----- ------------ ------------  ------------------------
2004-05-14 04:18:36 D....            0            0  dir1
2004-05-14 04:18:37 D....            0            0  dir2
2004-05-14 04:18:38 ....A      1572864       576885  2020 Super Baseball (J) [a1][hI].smc
2004-05-14 04:18:39 ....A      1572865               2020 Super Baseball (U).smc
2004-05-14 04:18:40                                  none.smc
2004-05-14 04:18:41 ....A        12345         1234  dir1/readme.txt
------------------- ----- ------------ ------------  ------------------------
2004-08-24 06:02:36            3158074       578119  4 files, 2 folders
`.split(/\n/);

  tools.run = jest.fn().mockReturnValue(Promise.resolve(lines));
  const info = await read('archive');
  expect(info).toMatchObject({
    path: '/Users/jbd/Super Baseball.zip',
    type: 'zip',
    physicalSize: 345677654,
    headersSize: 87654,
    method: 'xyz',
    solid: 'yes',
    blocks: 23,
  });
  expect(info.directories.length).toBe(2);

  expect(info.directories[0]).toMatchObject({
    attr: 'D....',
    compressed: 0,
    date: new Date('2004-05-14 04:18:36'),
    name: 'dir1',
    size: 0,
  });

  expect(info.directories[1]).toMatchObject({
    attr: 'D....',
    compressed: 0,
    date: new Date('2004-05-14 04:18:37'),
    name: 'dir2',
    size: 0,
  });

  expect(info.files.length).toBe(4);

  expect(info.files[0]).toMatchObject({
    attr: '....A',
    compressed: 576885,
    date: new Date('2004-05-14 04:18:38'),
    name: '2020 Super Baseball (J) [a1][hI].smc',
    size: 1572864,
  });

  expect(info.files[1]).toMatchObject({
    attr: '....A',
    compressed: 0,
    date: new Date('2004-05-14 04:18:39'),
    name: '2020 Super Baseball (U).smc',
    size: 1572865,
  });

  expect(info.files[2]).toMatchObject({
    attr: '     ',
    compressed: 0,
    date: new Date('2004-05-14 04:18:40'),
    name: 'none.smc',
    size: 0,
  });

  expect(info.files[3]).toMatchObject({
    attr: '....A',
    compressed: 1234,
    date: new Date('2004-05-14 04:18:41'),
    name: 'dir1/readme.txt',
    size: 12345,
  });
});
