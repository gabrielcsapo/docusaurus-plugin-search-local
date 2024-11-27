import { smartTerms } from './smartTerms';

describe('smartTerms', () => {
  test('it should create smart terms from a set of tokens', () => {
    const tokens = ['hello', 'world'];

    expect(
      smartTerms(tokens)
        .map((term) => term.map((item) => item.value))
        .flat(),
    ).toEqual(tokens);
  });
});
