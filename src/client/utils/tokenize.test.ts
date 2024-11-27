import { tokenize } from './tokenize';

describe('tokenize', () => {
  test('it should tokenize words', () => {
    expect(tokenize('Hello World')).toEqual(['hello', 'world']);
  });

  test('it should tokenize dasherized text', () => {
    expect(tokenize('Hello-World')).toEqual(['hello', 'world']);
  });
});
