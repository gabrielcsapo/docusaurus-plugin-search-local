import { PluginConfig } from "../../../types";
import { getGlobalPluginData } from "../getGlobalPluginData";

describe("getGlobalPluginData", () => {
  const baselinePluginConfig: PluginConfig = {
    id: "foo",
    indexDocs: true,
    indexBlog: true,
    indexPages: false,
    docsRouteBasePath: ["docs"],
    blogRouteBasePath: ["blog"],
    language: ["en"],
    hashed: false,
    docsDir: ["docs"],
    blogDir: ["blog"],
    removeDefaultStopWordFilter: false,
    highlightSearchTermsOnTargetPage: false,
    searchResultLimits: 8,
    searchResultContextMaxLength: 50,
    ignoreFiles: [],
    translations: {
      search_placeholder: "Search",
      see_all_results: "See all results",
      no_results: "No results.",
      search_results_for: 'Search results for "{{ keyword }}"',
      search_the_documentation: "Search the documentation",
      count_documents_found_plural: "{{ count }} documents found",
      count_documents_found: "{{ count }} document found",
      no_documents_were_found: "No documents were found",
    },
    externalSearchSources: [],
  };

  test("it should generate global plugin data", () => {
    const config: PluginConfig = { ...baselinePluginConfig };

    expect(getGlobalPluginData(config)).toEqual({
      externalSearchSources: config.externalSearchSources,
      indexHash: null,
      language: config.language,
      removeDefaultStopWordFilter: config.removeDefaultStopWordFilter,
      searchResultContextMaxLength: config.searchResultContextMaxLength,
      searchResultLimits: config.searchResultLimits,
      translations: config.translations,
    });
  });

  // TODO: write a test where an index hash is actually generated.
});
