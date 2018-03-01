const fn = require('../lib/rename');
const tools = require('../lib/tools');

test('file', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  const files = {};
  files['file 1.txt'] = 'file renamed 1.txt';
  files['xyz/file 2.txt'] = 'xyz/file renamed 2.txt';
  await fn('archive', files);
  expect(tools.run).toHaveBeenCalledWith(['rn', 'archive', 'file 1.txt', 'file renamed 1.txt', 'xyz/file 2.txt', 'xyz/file renamed 2.txt']);
});

test('single switch', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await fn('archive', { file1: 'file2' }, '-a');
  expect(tools.run).toHaveBeenCalledWith(['rn', '-a', 'archive', 'file1', 'file2']);
});

test('multiples switches', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await fn('archive', { file1: 'file2' }, ['-a', '-b']);
  expect(tools.run).toHaveBeenCalledWith(['rn', '-a', '-b', 'archive', 'file1', 'file2']);
});

test('returned value', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve(['azertyuiop', 'Items to compress: 34', 'azertyuiop']));
  const result = await fn('archive', { a: 'b' });
  expect(result).toBe(undefined);
});
