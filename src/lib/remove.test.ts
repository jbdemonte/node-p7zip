import { remove } from './remove';
const tools = require('./binary');

test('single file', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await remove('archive', 'file');
  expect(tools.run).toHaveBeenCalledWith(['d', 'archive', 'file']);
});

test('multiple files', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await remove('archive', ['file1', 'file2']);
  expect(tools.run).toHaveBeenCalledWith(['d', 'archive', 'file1', 'file2']);
});

test('single switch', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await remove('archive', ['file1', 'file2'], '-aze');
  expect(tools.run).toHaveBeenCalledWith(['d', '-aze', 'archive', 'file1', 'file2']);
});

test('multiple switches', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await remove('archive', ['file1', 'file2'], ['-aze', '-xyz']);
  expect(tools.run).toHaveBeenCalledWith(['d', '-aze', '-xyz', 'archive', 'file1', 'file2']);
});

test('returned value', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve(['azertyuiop', 'Items to delete: 34', 'azertyuiop']));
  const result = await remove('archive', 'file');
  expect(result).toBe(undefined);
});
