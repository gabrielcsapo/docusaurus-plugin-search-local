import { fetchIndexes } from './fetchIndexes';
import SEARCH_INDEX from './__fixtures__/search-index.json';

const mockFetch = (global.fetch = vi.fn());

describe('fetchIndexes', () => {
  const baseUrl = '/';
  const originalWarn = console.warn;

  beforeEach(() => {
    vi.resetModules(); // most important - it clears the cache
    mockFetch.mockReset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    console.warn = originalWarn;
  });

  test('production with empty index', async () => {
    process.env.NODE_ENV = 'production';
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    });
    const result = await fetchIndexes(baseUrl, 'abc');
    expect(mockFetch).toBeCalledWith('/search-index.json?_=abc');
    expect(result).toMatchSnapshot();
  });

  test('production', async () => {
    process.env.NODE_ENV = 'production';
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(SEARCH_INDEX),
    });
    const result = await fetchIndexes(baseUrl, 'abc');
    expect(mockFetch).toBeCalledWith('/search-index.json?_=abc');
    expect(result).toMatchSnapshot();
  });

  test('it should only add the index to the URL if provided', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    await fetchIndexes(baseUrl, 'abc');

    // Standard call with a hash
    expect(mockFetch).toBeCalledWith('/search-index.json?_=abc');

    // Not providing a hash index
    await fetchIndexes(baseUrl);

    // Should not add query param for hash index if generated hash is `null`.
    expect(mockFetch).toBeCalledWith('/search-index.json');
  });

  test('it should handle endpoint errors', async () => {
    mockFetch.mockRejectedValue(new Error('unable to fetch'));

    // Mock out warn.
    console.warn = vi.fn();

    const result = await fetchIndexes(baseUrl);

    // Result should be empty
    expect(result).toMatchSnapshot();

    // A warning should be sent to the browser console.
    expect(console.warn).toBeCalledWith(
      `[docusaurus-plugin-search-local] Unable to fetch search index from ${baseUrl}`,
    );
  });

  test('it should handle errors parsing the search index file', async () => {
    mockFetch.mockResolvedValueOnce({
      json: vi.fn().mockRejectedValue(new Error('unable to parse')),
    });

    // Mock out warn.
    console.warn = vi.fn();

    const result = await fetchIndexes(baseUrl);

    // Result should be empty
    expect(result).toMatchSnapshot();

    // A warning should be sent to the browser console.
    expect(console.warn).toBeCalledWith(
      `[docusaurus-plugin-search-local] Unable to parse search index from ${baseUrl}`,
    );
  });
});
