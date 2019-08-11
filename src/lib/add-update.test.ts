import { add, update } from './add-update';
const tools = require('./binary');

describe('add-update.ts', () => {
  test('single file', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await add('archive', 'file');
    expect(tools.run).toHaveBeenCalledWith(['a', 'archive', 'file']);
  });

  test('multiple files', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await add('archive', ['file1', 'file2']);
    expect(tools.run).toHaveBeenCalledWith(['a', 'archive', 'file1', 'file2']);
  });

  test('single switch', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await add('archive', ['file1', 'file2'], '-p123456789');
    expect(tools.run).toHaveBeenCalledWith(['a', '-p123456789', 'archive', 'file1', 'file2']);
  });

  test('multiple switches', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await add('archive', ['file1', 'file2'], ['-p123456789', '-xyz']);
    expect(tools.run).toHaveBeenCalledWith(['a', '-p123456789', '-xyz', 'archive', 'file1', 'file2']);
  });

  test('returned value', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve(['azertyuiop', 'Items to compress: 34', 'azertyuiop']));
    const result = await add('archive', 'file');
    expect(result).toBe(34);
  });
});

describe('update', () => {
  test('single file', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await update('archive', 'file');
    expect(tools.run).toHaveBeenCalledWith(['u', 'archive', 'file']);
  });

  test('multiple files', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await update('archive', ['file1', 'file2']);
    expect(tools.run).toHaveBeenCalledWith(['u', 'archive', 'file1', 'file2']);
  });

  test('single switch', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await update('archive', ['file1', 'file2'], '-p123456789');
    expect(tools.run).toHaveBeenCalledWith(['u', '-p123456789', 'archive', 'file1', 'file2']);
  });

  test('multiple switches', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve([]));
    await update('archive', ['file1', 'file2'], ['-p123456789', '-xyz']);
    expect(tools.run).toHaveBeenCalledWith(['u', '-p123456789', '-xyz', 'archive', 'file1', 'file2']);
  });

  test('returned value', async () => {
    tools.run = jest.fn().mockReturnValue(Promise.resolve(['azertyuiop', 'Items to compress: 34', 'azertyuiop']));
    const result = await update('archive', 'file');
    expect(result).toBe(34);
  });
});
