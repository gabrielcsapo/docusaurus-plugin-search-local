import lunr from 'lunr';
import type { SearchDocument, WrappedIndex } from '../../types';

export function buildIndex(
  allDocuments: SearchDocument[][],
): Omit<WrappedIndex, 'type'>[] {
  return allDocuments.map((documents) => ({
    documents,
    index: lunr(function () {
      this.ref('i');
      this.field('t');
      this.metadataWhitelist = ['position'];

      documents.forEach((doc) => {
        this.add({
          ...doc,
          // The ref must be a string.
          i: doc.i.toString(),
        });
      });
    }),
  }));
}
