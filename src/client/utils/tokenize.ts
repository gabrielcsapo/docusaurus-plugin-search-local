/**
 * Split a sentence to tokens, considering a sequence of consecutive Chinese words as a single token.
 *
 * @param text - Text to be tokenized.
 *
 * @returns Tokens.
 */
export function tokenize(text: string): string[] {
  const regExpMatchWords = /[^-\s]+/g;

  return text.toLowerCase().match(regExpMatchWords) || [];
}
