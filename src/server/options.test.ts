import { ValidationResult, ValidationSchema } from "@docusaurus/types";
import type { PluginOptions } from "docusaurus-plugin-search-local";
import { validateOptions } from "./options";

describe("validateOptions", () => {
  const defaultTranslations = {
    search_placeholder: "Search",
    see_all_results: "See all results",
    no_results: "No results.",
    search_results_for: 'Search results for "{{ keyword }}"',
    search_the_documentation: "Search the documentation",
    count_documents_found: "{{ count }} document found",
    count_documents_found_plural: "{{ count }} documents found",
    no_documents_were_found: "No documents were found",
  };

  function validate(
    schema: ValidationSchema<PluginOptions>,
    options: Partial<PluginOptions>
  ): ValidationResult<PluginOptions> {
    const { error, value } = schema.validate(options, {
      convert: false,
    });
    if (error) {
      throw error;
    }
    return value;
  }

  test.each<[Partial<PluginOptions>, Omit<PluginOptions, "id">]>([
    [
      {},
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        translations: defaultTranslations,
        externalSearchSources: [],
      },
    ],
    [
      { ignoreFiles: "file1" },
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: "file1",
        translations: defaultTranslations,
        externalSearchSources: [],
      },
    ],
    [
      { ignoreFiles: [/__meta__$/, "file1"] },
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: [/__meta__$/, "file1"],
        translations: defaultTranslations,
        externalSearchSources: [],
      },
    ],
    [
      {
        docsDir: "src/docs",
        blogDir: "src/blog",
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 5,
        searchResultContextMaxLength: 30,
      },
      {
        blogRouteBasePath: ["blog"],
        blogDir: "src/blog",
        docsRouteBasePath: ["docs"],
        docsDir: "src/docs",
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 5,
        searchResultContextMaxLength: 30,
        ignoreFiles: [],
        translations: defaultTranslations,
        externalSearchSources: [],
      },
    ],
    [
      {
        docsRouteBasePath: "/dev/docs",
        blogRouteBasePath: "/dev/blog",
      },
      {
        blogRouteBasePath: "/dev/blog",
        blogDir: ["blog"],
        docsRouteBasePath: "/dev/docs",
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        translations: defaultTranslations,
        externalSearchSources: [],
      },
    ],
    [
      {
        docsRouteBasePath: ["/dev/docs"],
        blogRouteBasePath: ["/dev/blog"],
      },
      {
        blogRouteBasePath: ["/dev/blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["/dev/docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        translations: defaultTranslations,
        externalSearchSources: [],
      },
    ],
    [
      {
        translations: {
          search_placeholder: "??????",
          see_all_results: "??????????????????",
          no_results: "???????????????????????????",
          search_results_for: "?????? ???{{ keyword }}???",
          search_the_documentation: "????????????",
          count_documents_found: "????????? {{ count }} ?????????",
          count_documents_found_plural: "????????? {{ count }} ?????????",
          no_documents_were_found: "????????????????????????",
        },
      },
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        translations: {
          search_placeholder: "??????",
          see_all_results: "??????????????????",
          no_results: "???????????????????????????",
          search_results_for: "?????? ???{{ keyword }}???",
          search_the_documentation: "????????????",
          count_documents_found: "????????? {{ count }} ?????????",
          count_documents_found_plural: "????????? {{ count }} ?????????",
          no_documents_were_found: "????????????????????????",
        },
        externalSearchSources: [],
      },
    ],
    [
      {
        translations: {
          search_placeholder: "??????",
          see_all_results: "??????????????????",
          no_results: "???????????????????????????",
          search_results_for: "?????? ???{{ keyword }}???",
          search_the_documentation: "????????????",
          count_documents_found: "?????????????????????",
          // Explicitly override `*_plural`.
          count_documents_found_plural: "????????? {{ count }} ?????????",
          no_documents_were_found: "????????????????????????",
        },
      },
      {
        blogRouteBasePath: ["blog"],
        blogDir: ["blog"],
        docsRouteBasePath: ["docs"],
        docsDir: ["docs"],
        hashed: false,
        indexBlog: true,
        indexDocs: true,
        indexPages: false,
        removeDefaultStopWordFilter: false,
        highlightSearchTermsOnTargetPage: false,
        searchResultLimits: 5,
        searchResultContextMaxLength: 50,
        ignoreFiles: [],
        translations: {
          search_placeholder: "??????",
          see_all_results: "??????????????????",
          no_results: "???????????????????????????",
          search_results_for: "?????? ???{{ keyword }}???",
          search_the_documentation: "????????????",
          count_documents_found: "?????????????????????",
          count_documents_found_plural: "????????? {{ count }} ?????????",
          no_documents_were_found: "????????????????????????",
        },
        externalSearchSources: [],
      },
    ],
  ])("validateOptions(...) should work", (options, config) => {
    expect(validateOptions({ options, validate })).toEqual(config);
  });
});
