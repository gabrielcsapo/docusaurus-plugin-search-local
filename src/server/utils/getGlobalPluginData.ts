import { GlobalPluginData } from "docusaurus-plugin-search-local";
import { PluginConfig } from "../../types";

export function getGlobalPluginData(
  pluginConfig: PluginConfig
): GlobalPluginData {
  const {
    externalSearchSources,
    language,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
  } = pluginConfig;

  // TODO: generate index hash

  return {
    externalSearchSources,
    indexHash: null,
    language,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
  };
}
