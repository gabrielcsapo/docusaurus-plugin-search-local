import lunr from "lunr";
import { fetchIndexes } from "../fetchIndexes";

jest.mock("lunr");

const mockLunrIndexLoad = (
  jest.spyOn(lunr.Index, "load") as any
).mockImplementation(() => `loaded-index`);

const mockFetch = (global.fetch = jest.fn());

describe("fetchIndexes", () => {
  const baseUrl = "/";

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // most important - it clears the cache
    process.env = { ...OLD_ENV }; // make a copy
    mockFetch.mockReset();
  });

  afterAll(() => {
    process.env = OLD_ENV; // restore old env

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
              invertedIndex: [
                ["hello"],
                ["alfabetização"],
                ["世界"],
                ["和平"],
                ["世界"],
                ["hello"],
              ],
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
      zhDictionary: ["世界", "和平"],
    });
  });

  test.skip("development", async () => {
    process.env.NODE_ENV = "development";
    const result = await fetchIndexes(baseUrl);
    expect(mockFetch).not.toBeCalled();
    expect(result).toEqual({
      wrappedIndexes: [],
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
