import { looseTokenize } from './looseTokenize';

describe('looseTokenize', () => {
  test.each<[string, string[]]>([
    ['I have a dog', ['I', ' ', 'have', ' ', 'a', ' ', 'dog']],
  ])("looseTokenize('%s') should return %j", (content, tokens) => {
    expect(looseTokenize(content)).toEqual(tokens);
  });
});
