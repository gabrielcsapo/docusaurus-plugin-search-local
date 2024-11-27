import { SmartTerm } from '../../types';

/**
 * Convert a list of tokens into smart terms.
 *
 * @privateRemarks
 *
 * This function seems like it is needed to support different languages and can likely be refactored
 * to flatten the data structures involved.
 *
 * @param tokens - Tokens consists of English.
 *
 * @returns A smart term list.
 */
export function smartTerms(tokens: string[]): SmartTerm[] {
  const terms: SmartTerm[] = [];

  function cutMixedWords(subTokens: string[], carry: SmartTerm): void {
    if (subTokens.length === 0) {
      terms.push(carry);
      return;
    }
    const token = subTokens[0];
    const nextCarry = carry.concat({
      value: token,
    });
    cutMixedWords(subTokens.slice(1), nextCarry);
  }

  cutMixedWords(tokens, []);

  return terms;
}
