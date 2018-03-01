const fn = require('../lib/add');
const tools = require('../lib/tools');

test('single file', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await fn('archive', 'file');
  expect(tools.run).toHaveBeenCalledWith(['a', 'archive', 'file']);
});

test('multiple files', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await fn('archive', ['file1', 'file2']);
  expect(tools.run).toHaveBeenCalledWith(['a', 'archive', 'file1', 'file2']);
});

test('single switch', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await fn('archive', ['file1', 'file2'], '-p123456789');
  expect(tools.run).toHaveBeenCalledWith(['a', '-p123456789', 'archive', 'file1', 'file2']);
});

test('multiple switches', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await fn('archive', ['file1', 'file2'], ['-p123456789', '-xyz']);
  expect(tools.run).toHaveBeenCalledWith(['a', '-p123456789', '-xyz', 'archive', 'file1', 'file2']);
});

test('returned value', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve(['azertyuiop', 'Items to compress: 34', 'azertyuiop']));
  const result = await fn('archive', 'file');
  expect(result).toBe(34);
});
