import { describe, test, expect } from 'vitest';
import { buildIndex } from './buildIndex';
import { SearchDocument } from '../../types';

describe('buildIndex', () => {
  const allDocuments: Partial<SearchDocument>[][] = [
    [
      {
        i: 1,
        t: 'Hello World if any',
      },
      {
        i: 2,
        t: '你好世界',
      },
      {
        i: 3,
        t: 'Hola Mundo',
      },
      {
        i: 4,
        t: '私は電車が好きです。',
      },
    ],
  ];

  test('it should build an index', () => {
    const wrappedIndexes = buildIndex(allDocuments as SearchDocument[][]);

    // lunr does not index common words
    expect(wrappedIndexes[0].index.search('if')).toEqual([]);

    // lunr should index hello
    expect(wrappedIndexes[0].index.search('hello')).toEqual([
      expect.objectContaining({
        ref: '1',
        matchData: {
          metadata: {
            hello: {
              t: {
                position: [[0, 5]],
              },
            },
          },
        },
      }),
    ]);
  });
});
