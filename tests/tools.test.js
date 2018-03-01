const tools = require('../lib/tools');

describe('nop', () => {
  test('return undefined', () => {
    expect(tools.nop()).toBe(undefined);
  });
  test('return undefined trying async', async () => {
    const result = await tools.nop();
    expect(result).toBe(undefined);
  });
});

describe('start', () => {
  test('empty haystack', () => {
    expect(tools.start('', 'aze')).toBe(false);
  });
  test('spaced haystack', () => {
    expect(tools.start(' azerty', 'aze')).toBe(false);
  });
  test('case mismatch', () => {
    expect(tools.start('aZerty', 'aze')).toBe(false);
    expect(tools.start('azerty', 'aZe')).toBe(false);
  });
  test('match', () => {
    expect(tools.start('aze', 'aze')).toBe(true);
    expect(tools.start('azerty', 'aze')).toBe(true);
  });
});

describe('run', () => {
  test('info', async () => {
    const result = await tools.run([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result[1].substring(0, 5)).toBe('7-Zip');
  });

  test('error', async () => expect(tools.run(['e'])).rejects.toMatchObject({ message: 'Command exit with code 7' }));
});

describe('cb_decorate', () => {
  const sum = (...args) => new Promise((resolve, reject) => {
    if (args.length !== 2) {
      reject(new Error('args mismatch'));
    } else {
      resolve(args[0] + args[1]);
    }
  });

  test('promise', async () => {
    const fn = tools.cb_decorate(sum);
    const res = await fn(2, 3);
    expect(res).toBe(5);
  });

  test('promise rejection', () => {
    const fn = tools.cb_decorate(sum);
    return expect(fn()).rejects.toMatchObject({ message: 'args mismatch' });
  });

  test('callback', (done) => {
    const fn = tools.cb_decorate(sum);
    fn(2, 3, (err, res) => {
      expect(err).toBe(null);
      expect(res).toBe(5);
      done();
    });
  });

  test('callback with error', (done) => {
    const fn = tools.cb_decorate(sum);
    fn((err, res) => {
      expect(err).toMatchObject({ message: 'args mismatch' });
      expect(res).toBe(undefined);
      done();
    });
  });
});
