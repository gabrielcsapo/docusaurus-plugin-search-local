import path from "path";
import fs from "fs-extra";
import { normalizeUrl } from "@docusaurus/utils";
import type { PluginOptions } from "docusaurus-plugin-search-local";
import { getPluginConfig } from "./utils/getPluginConfig";
import { postBuildFactory } from "./utils/postBuildFactory";
import { generate } from "./utils/generate";
import { LoadContext, Plugin } from "@docusaurus/types";

const PLUGIN_NAME = "docusaurus-plugin-search-local";

export default function DocusaurusSearchLocalPlugin(
  context: LoadContext,
  options: PluginOptions
): Plugin {
  const config = getPluginConfig(options, context.siteDir);

  const dir = path.join(context.generatedFilesDir, PLUGIN_NAME, "default");
  fs.ensureDirSync(dir);
  generate(config, dir);

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

    async contentLoaded({ actions: { addRoute } }) {
      addRoute({
        path: normalizeUrl([context.baseUrl, "search"]),
        component: "@theme/SearchPage",
        exact: true,
      });
    },
  };
}

export { validateOptions } from "./options";
