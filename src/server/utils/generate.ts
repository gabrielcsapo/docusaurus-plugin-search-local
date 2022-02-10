import fs from "fs";
import path from "path";
import { PluginConfig } from "../../types";
import { getIndexHash } from "./getIndexHash";

export function generate(config: PluginConfig, dir: string): void {
  const {
    removeDefaultStopWordFilter,
    searchResultLimits,
    searchResultContextMaxLength,
    translations,
  } = config;
  const indexHash = getIndexHash(config);
  const contents: string[] = [];
  contents.push(
    `export const removeDefaultStopWordFilter = ${JSON.stringify(
      removeDefaultStopWordFilter
    )};`
  );
  contents.push(`export const indexHash = ${JSON.stringify(indexHash)};`);
  contents.push(
    `export const searchResultLimits = ${JSON.stringify(searchResultLimits)};`,
    `export const searchResultContextMaxLength = ${JSON.stringify(
      searchResultContextMaxLength
    )};`
  );
  contents.push(`export const translations = ${JSON.stringify(translations)};`);

  fs.writeFileSync(path.join(dir, "generated.js"), contents.join("\n"));
}
