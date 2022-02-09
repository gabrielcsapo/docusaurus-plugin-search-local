export type PluginOptions = {
  blogDir: string | string[];
  blogRouteBasePath: string | string[];
  docsDir: string | string[];
  docsRouteBasePath: string | string[];
  hashed: boolean;
  highlightSearchTermsOnTargetPage: boolean;
  ignoreFiles: string | RegExp | (string | RegExp)[];
  indexBlog: boolean;
  indexDocs: boolean;
  indexPages: boolean;
  language: string | string[];
  removeDefaultStopWordFilter: boolean;
  searchEndpoints: string[]; // TODO: rename this to externalSearchSources
  searchResultContextMaxLength: number;
  searchResultLimits: number;
  translations: TranslationMap;
};

export type Options = Partial<PluginOptions>;
