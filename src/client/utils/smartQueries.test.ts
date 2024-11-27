import lunr from 'lunr';
import { smartQueries } from './smartQueries';
import { SmartQuery } from '../../types';

(lunr as any).fake = {};

interface TestQuery {
  tokens: string[];
  keyword: string;
}

describe('smartQueries', () => {
  test.each<[string[], TestQuery[]]>([
    [
      ['hello'],
      [
        {
          tokens: ['hello'],
          keyword: '+hello',
        },
        {
          tokens: ['hello'],
          keyword: '+hello*',
        },
      ],
    ],
    [
      ['hello', 'world'],
      [
        {
          tokens: ['hello', 'world'],
          keyword: '+hello +world',
        },
        {
          tokens: ['hello', 'world'],
          keyword: '+hello +world*',
        },
      ],
    ],
    [
      ['a', 'hello', 'world'],
      [
        {
          tokens: ['a', 'hello', 'world'],
          keyword: '+a +hello +world',
        },
        {
          tokens: ['hello', 'world'],
          keyword: '+hello +world',
        },
        {
          tokens: ['a', 'hello', 'world'],
          keyword: '+a +hello +world*',
        },
        {
          tokens: ['hello', 'world'],
          keyword: '+hello +world*',
        },
      ],
    ],
    [
      ['hello', 'a'],
      [
        {
          tokens: ['hello', 'a'],
          keyword: '+hello +a',
        },
        {
          tokens: ['hello'],
          keyword: '+hello',
        },
        {
          tokens: ['hello', 'a'],
          keyword: '+hello +a*',
        },
      ],
    ],
    [
      ['a'],
      [
        {
          tokens: ['a'],
          keyword: '+a',
        },
        {
          tokens: ['a'],
          keyword: '+a*',
        },
      ],
    ],
  ])('smartQueries(%j) should work', (tokens, queries) => {
    const sQueries = smartQueries(tokens, {
      removeDefaultStopWordFilter: false,
    });

    expect(sQueries.map(transformQuery)).toEqual(queries);
  });
});

describe('smartQueries with no stop words filter', () => {
  test.each<[string[], TestQuery[]]>([
    [
      ['a', 'hello'],
      [
        {
          tokens: ['a', 'hello'],
          keyword: '+a +hello',
        },
        {
          tokens: ['a', 'hello'],
          keyword: '+a +hello*',
        },
      ],
    ],
  ])('smartQueries(%j) should work', (tokens, queries) => {
    const sQueries = smartQueries(tokens, {
      removeDefaultStopWordFilter: true,
    });

    expect(sQueries.map(transformQuery)).toEqual(queries);
  });
});

function transformQuery(query: SmartQuery): TestQuery {
  return {
    tokens: query.tokens,
    keyword: query.term
      .map(
        (item) =>
          `${item.presence === lunr.Query.presence.REQUIRED ? '+' : ''}${
            (item.wildcard & lunr.Query.wildcard.LEADING) ===
            lunr.Query.wildcard.LEADING
              ? '*'
              : ''
          }${item.value}${
            (item.wildcard & lunr.Query.wildcard.TRAILING) ===
            lunr.Query.wildcard.TRAILING
              ? '*'
              : ''
          }`,
      )
      .join(' '),
  };
}
