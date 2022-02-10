import lunr from "lunr";
import { fetchIndexes } from "../fetchIndexes";

jest.mock("lunr");

const mockLunrIndexLoad = (
  jest.spyOn(lunr.Index, "load") as any
).mockImplementation(() => `loaded-index`);

const mockFetch = (global.fetch = jest.fn());

describe("fetchIndexes", () => {
  const baseUrl = "/";

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    mockFetch.mockReset();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("production with empty index", async () => {
    process.env.NODE_ENV = "production";
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve([]),
    });
    const result = await fetchIndexes(baseUrl, "abc");
    expect(mockFetch).toBeCalledWith("/search-index.json?_=abc");
    expect(result).toEqual({
      wrappedIndexes: [],
      zhDictionary: [],
    });
  });

  test("production", async () => {
    process.env.NODE_ENV = "production";
    mockLunrIndexLoad;
    mockFetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve([
          {
            documents: [1, 2, 3],
            index: {
              invertedIndex: [["hello"], ["hello"]],
            },
          },
        ]),
    });
    const result = await fetchIndexes(baseUrl, "abc");
    expect(mockFetch).toBeCalledWith("/search-index.json?_=abc");
    expect(result).toEqual({
      wrappedIndexes: [
        {
          documents: [1, 2, 3],
          index: "loaded-index",
          type: 0,
        },
      ],
      zhDictionary: [],
    });
  });

  test("it should only add the index to the URL if provided", async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    await fetchIndexes(baseUrl, "abc");

    // Standard call with a hash
    expect(mockFetch).toBeCalledWith("/search-index.json?_=abc");

    // Not providing a hash index
    await fetchIndexes(baseUrl);

    // Should not add query param for hash index if generated hash is `null`.
    expect(mockFetch).toBeCalledWith("/search-index.json");
  });
});
