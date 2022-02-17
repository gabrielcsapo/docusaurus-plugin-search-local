import lunr from "lunr";
import { SearchDocument, SearchDocumentType, WrappedIndex } from "../../types";

interface SerializedIndex {
  documents: SearchDocument[];
  index: {
    invertedIndex: [string][];
  };
}

export async function fetchIndexes(
  baseUrl: string,
  indexHash: string | null = null
): Promise<{
  wrappedIndexes: WrappedIndex[];
}> {
  const indexUrl = `${baseUrl}search-index.json`;
  const queryString = indexHash ? `?_=${indexHash}` : "";

  const json = (await (
    await fetch(`${indexUrl}${queryString}`)
  ).json()) as SerializedIndex[];

  const wrappedIndexes: WrappedIndex[] = json.map(
    ({ documents, index }, type) => ({
      type: type as SearchDocumentType,
      documents,
      index: lunr.Index.load(index),
    })
  );

  return {
    wrappedIndexes,
  };
}
