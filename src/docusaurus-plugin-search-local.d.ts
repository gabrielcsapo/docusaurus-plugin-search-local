export type ExternalSourceConfig = {
  heading: string;
  uri: string;
};

export type TranslationMap = {
  search_placeholder: string;
  see_all_results: string;
  no_results: string;
  search_results_for: string;
  search_the_documentation: string;
  count_documents_found: string;
  count_documents_found_plural: string;
  no_documents_were_found: string;
};

export type GlobalPluginData = {
  externalSearchSources: ExternalSourceConfig[];
  indexHash: string | null;
  removeDefaultStopWordFilter: boolean;
  searchResultContextMaxLength: number;
  searchResultLimits: number;
  translations: TranslationMap;
};

export type PluginOptions = {
  blogDir: string | string[];
  blogRouteBasePath: string | string[];
  docsDir: string | string[];
  docsRouteBasePath: string | string[];
  externalSearchSources: ExternalSourceConfig[];
  hashed: boolean;
  highlightSearchTermsOnTargetPage: boolean;
  id: string;
  ignoreFiles: string | RegExp | (string | RegExp)[];
  indexBlog: boolean;
  indexDocs: boolean;
  indexPages: boolean;
  removeDefaultStopWordFilter: boolean;
  searchResultContextMaxLength: number;
  searchResultLimits: number;
  translations: TranslationMap;
};

export type Options = Partial<PluginOptions>;
