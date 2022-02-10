import { normalizePluginOptions } from "@docusaurus/utils-validation";
import { getPluginConfig } from "../getPluginConfig";
import { OptionsSchema } from "../../options";

describe("getPluginConfig", () => {
  const siteDir = "/tmp";

  test("it should normalize strings into arrays", () => {
    const userOptions = normalizePluginOptions(OptionsSchema, {
      blogRouteBasePath: "blog",
    });

    const normalizedOptions = getPluginConfig(userOptions, siteDir);

    expect(normalizedOptions.blogRouteBasePath).toEqual(["blog"]);
  });

  test("it should strip slashes from base paths", () => {
    const userOptions = normalizePluginOptions(OptionsSchema, {
      blogRouteBasePath: "/blog",
      docsRouteBasePath: "/docs",
    });

    const normalizedOptions = getPluginConfig(userOptions, siteDir);

    expect(normalizedOptions.blogRouteBasePath).toEqual(["blog"]);
    expect(normalizedOptions.docsRouteBasePath).toEqual(["docs"]);
  });

  test("it should resolve blog and docs directories", () => {
    const userOptions = normalizePluginOptions(OptionsSchema, {
      blogDir: "blog",
      docsDir: "docs",
    });

    const normalizedOptions = getPluginConfig(userOptions, siteDir);

    expect(normalizedOptions.blogDir).toEqual(["/tmp/blog"]);
    expect(normalizedOptions.docsDir).toEqual(["/tmp/docs"]);
  });

  test("it should process external search endpoints", () => {
    expect(
      getPluginConfig(normalizePluginOptions(OptionsSchema, {}), siteDir)
        .externalSearchSources
    ).toStrictEqual([]);
  });
});
