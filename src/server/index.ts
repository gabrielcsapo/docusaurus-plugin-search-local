import path from "path";
import { normalizeUrl } from "@docusaurus/utils";
import { LoadContext, Plugin } from "@docusaurus/types";
import type {
  GlobalPluginData,
  PluginOptions,
} from "docusaurus-plugin-search-local";

import { getPluginConfig } from "./utils/getPluginConfig";
import { getGlobalPluginData } from "./utils/getGlobalPluginData";
import { postBuildFactory } from "./utils/postBuildFactory";

const PLUGIN_NAME = "docusaurus-plugin-search-local";

export default function DocusaurusSearchLocalPlugin(
  context: LoadContext,
  options: PluginOptions
): Plugin {
  const config = getPluginConfig(options, context.siteDir);

  const themePath = path.resolve(__dirname, "../client/theme");
  const pagePath = path.join(themePath, "SearchPage/index.js");

  return {
    name: PLUGIN_NAME,

    getThemePath() {
      return themePath;
    },

    postBuild: postBuildFactory(config),

    getPathsToWatch() {
      return [pagePath];
    },

    async contentLoaded({ actions: { addRoute, setGlobalData } }) {
      addRoute({
        path: normalizeUrl([context.baseUrl, "search"]),
        component: "@theme/SearchPage",
        exact: true,
      });

      // Setting global data for use on client side.
      setGlobalData(getGlobalPluginData(config));
    },
  };
}

export { validateOptions } from "./options";
