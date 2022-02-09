export type PluginOptions = {
  blogDir: string | string[];
  blogRouteBasePath: string | string[];
  docsDir: string | string[];
  docsRouteBasePath: string | string[];
  externalSearchSources: string[];
  hashed: boolean;
  highlightSearchTermsOnTargetPage: boolean;
  ignoreFiles: string | RegExp | (string | RegExp)[];
  indexBlog: boolean;
  indexDocs: boolean;
  indexPages: boolean;
  language: string | string[];
  removeDefaultStopWordFilter: boolean;
  searchResultContextMaxLength: number;
  searchResultLimits: number;
  translations: TranslationMap;
};

export type Options = Partial<PluginOptions>;
