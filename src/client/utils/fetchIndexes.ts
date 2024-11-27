import lunr from 'lunr';
import { SearchDocument, SearchDocumentType, WrappedIndex } from '../../types';

interface SerializedIndex {
  documents: SearchDocument[];
  index: {
    invertedIndex: [string][];
  };
}

interface FetchIndexResponse {
  wrappedIndexes: WrappedIndex[];
}

const EMPTY_RESPONSE: FetchIndexResponse = Object.freeze({
  wrappedIndexes: [],
});

export async function fetchIndexes(
  baseUrl: string,
  indexHash: string | null = null,
): Promise<FetchIndexResponse> {
  const indexUrl = `${baseUrl}search-index.json`;
  const queryString = indexHash ? `?_=${indexHash}` : '';

  let result;

  try {
    result = await fetch(`${indexUrl}${queryString}`);
  } catch {
    console.warn(
      `[docusaurus-plugin-search-local] Unable to fetch search index from ${baseUrl}`,
    );
    return EMPTY_RESPONSE;
  }

  let searchIndexRaw: SerializedIndex[];

  try {
    searchIndexRaw = await result.json();
  } catch {
    console.warn(
      `[docusaurus-plugin-search-local] Unable to parse search index from ${baseUrl}`,
    );
    return EMPTY_RESPONSE;
  }

  const wrappedIndexes: WrappedIndex[] = searchIndexRaw.map(
    ({ documents, index }, type) => ({
      type: type as SearchDocumentType,
      documents,
      index: lunr.Index.load(index),
    }),
  );

  return {
    wrappedIndexes,
  };
}
