import type { GlobalPluginData } from 'docusaurus-plugin-search-local';
import type { PluginConfig } from '../../types';
import { getIndexHash } from './getIndexHash';

export function getGlobalPluginData(
  pluginConfig: PluginConfig,
): GlobalPluginData {
  const {
    externalSearchSources,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
    highlightSearchTermsOnTargetPage,
  } = pluginConfig;

  return {
    externalSearchSources,
    removeDefaultStopWordFilter,
    searchResultContextMaxLength,
    searchResultLimits,
    translations,
    highlightSearchTermsOnTargetPage,
    indexHash: getIndexHash(pluginConfig),
  };
}
