import { run } from './binary';

test('info', async () => {
  const result = await run([]);
  expect(Array.isArray(result)).toBe(true);
  expect(result[1].substring(0, 5)).toBe('7-Zip');
});

test('error', async () => expect(run(['e'])).rejects.toMatchObject({ message: 'Command exit with code 7' }));
