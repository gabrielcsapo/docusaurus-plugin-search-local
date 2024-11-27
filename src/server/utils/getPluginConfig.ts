import path from 'path';
import type { PluginOptions } from 'docusaurus-plugin-search-local';
import { PluginConfig } from '../../types';

function getArrayOption<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function getPluginConfig(
  options: PluginOptions,
  siteDir: string,
): PluginConfig {
  const {
    blogDir,
    blogRouteBasePath,
    docsDir,
    docsRouteBasePath,
    externalSearchSources,
    hashed,
    highlightSearchTermsOnTargetPage,
    id,
    ignoreFiles,
    indexBlog,
    indexDocs,
    indexPages,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
  } = options;

  const config: PluginConfig = {
    externalSearchSources,
    hashed,
    highlightSearchTermsOnTargetPage,
    id,
    indexBlog,
    indexDocs,
    indexPages,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
    blogDir: getArrayOption(blogDir).map((dir) => path.resolve(siteDir, dir)),
    docsDir: getArrayOption(docsDir).map((dir) => path.resolve(siteDir, dir)),
    blogRouteBasePath: getArrayOption(blogRouteBasePath).map((basePath) =>
      basePath.replace(/^\//, ''),
    ),
    docsRouteBasePath: getArrayOption(docsRouteBasePath).map((basePath) =>
      basePath.replace(/^\//, ''),
    ),

    ignoreFiles: getArrayOption(ignoreFiles),
  };

  return config;
}
