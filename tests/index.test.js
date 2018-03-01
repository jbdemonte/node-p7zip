const mod = require('../index');

class FakePromise {
  then() {
    return this;
  }
  catch() {
    return this;
  }
}


test('Promise replacement', () => {
  expect(mod.Promise).toBe(Promise);
  mod.Promise = FakePromise;
  expect(mod.Promise).toBe(FakePromise);
  const promise = mod.add('archive', 'file');
  expect(promise).toBeInstanceOf(FakePromise);
});
