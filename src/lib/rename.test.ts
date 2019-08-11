import { rename } from './rename';
const tools = require('./binary');

test('file', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await rename('archive', 'file1', 'file2');
  expect(tools.run).toHaveBeenCalledWith(['rn', 'archive', 'file1', 'file2']);
});

test('single switch', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await rename('archive', 'file1', 'file2', '-a');
  expect(tools.run).toHaveBeenCalledWith(['rn', '-a', 'archive', 'file1', 'file2']);
});

test('multiples switches', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await rename('archive', 'file1', 'file2', ['-a', '-b']);
  expect(tools.run).toHaveBeenCalledWith(['rn', '-a', '-b', 'archive', 'file1', 'file2']);
});

test('returned value', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve(['azertyuiop', 'ghjk']));
  const result = await rename('archive', 'file1', 'file2');
  expect(result).toBe(undefined);
});
