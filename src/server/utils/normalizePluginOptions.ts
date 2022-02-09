import path from "path";
import type { PluginOptions } from "docusaurus-plugin-search-local";
import { ProcessedPluginOptions } from "../../shared/types";

function getArrayOption<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function normalizePluginOptions(
  options: PluginOptions,
  siteDir: string
): ProcessedPluginOptions {
  const {
    blogDir,
    blogRouteBasePath,
    docsDir,
    docsRouteBasePath,
    hashed,
    highlightSearchTermsOnTargetPage,
    ignoreFiles,
    indexBlog,
    indexDocs,
    indexPages,
    language,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
  } = options;

  const config: ProcessedPluginOptions = {
    indexBlog,
    indexDocs,
    indexPages,
    hashed,
    highlightSearchTermsOnTargetPage,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
    blogDir: getArrayOption(blogDir).map((dir) => path.resolve(siteDir, dir)),
    docsDir: getArrayOption(docsDir).map((dir) => path.resolve(siteDir, dir)),
    blogRouteBasePath: getArrayOption(blogRouteBasePath).map((basePath) =>
      basePath.replace(/^\//, "")
    ),
    docsRouteBasePath: getArrayOption(docsRouteBasePath).map((basePath) =>
      basePath.replace(/^\//, "")
    ),

    language: getArrayOption(language),

    ignoreFiles: getArrayOption(ignoreFiles),
    externalSearchSources: [], // TODO: this is likely going to fail tests.
  };

  return config;
}
