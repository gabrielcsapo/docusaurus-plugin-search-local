import { GlobalPluginData } from "docusaurus-plugin-search-local";
import { PluginConfig } from "../../types";

export function getGlobalPluginData(
  pluginConfig: PluginConfig
): GlobalPluginData {
  const {
    externalSearchSources,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
  } = pluginConfig;

  return {
    externalSearchSources,
    indexHash: null, // TODO: generate index hash
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
  };
}
