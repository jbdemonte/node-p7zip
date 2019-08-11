import { extract } from './extract';
const tools = require('./binary');

test('simple extract', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive');
  expect(tools.run).toHaveBeenCalledWith(['x', '-aoa', 'archive']);
});

test('destination', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', 'destination');
  expect(tools.run).toHaveBeenCalledWith(['x', '-odestination', '-aoa', 'archive']);
});

test('single file filter', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', null, 'file');
  expect(tools.run).toHaveBeenCalledWith(['x', '-aoa', 'archive', 'file']);
});

test('multiple files filter', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', null, ['file1', 'file2']);
  expect(tools.run).toHaveBeenCalledWith(['x', '-aoa', 'archive', 'file1', 'file2']);
});

test('single switch', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', null, null, '-a');
  expect(tools.run).toHaveBeenCalledWith(['x', '-a', '-aoa', 'archive']);
});

test('multiple switches', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', null, null, ['-a', '-b']);
  expect(tools.run).toHaveBeenCalledWith(['x', '-a', '-b', '-aoa', 'archive']);
});

test('full path = true', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', null, null, null, true);
  expect(tools.run).toHaveBeenCalledWith(['x', '-aoa', 'archive']);
});

test('full path = false', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  await extract('archive', null, null, null, false);
  expect(tools.run).toHaveBeenCalledWith(['e', '-aoa', 'archive']);
});

['-aoa', '-aos', '-aou', '-aot'].forEach(item => {
  test(`No overwrite mode preset: ${item} `, async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await extract('archive', null, null, item);
    expect(tools.run).toHaveBeenCalledWith(['x', item, 'archive']);
  });
});

test('returned value', async () => {
  tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
  const result = await extract('archive');
  expect(result).toBe(undefined);
});
