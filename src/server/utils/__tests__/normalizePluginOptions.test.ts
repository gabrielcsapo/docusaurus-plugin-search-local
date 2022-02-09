import { normalizePluginOptions as fillPluginOptions } from "@docusaurus/utils-validation";
import { normalizePluginOptions } from "../normalizePluginOptions";
import { OptionsSchema } from "../../options";

describe("normalizePluginOptions", () => {
  const siteDir = "/tmp";

  test("it should normalize strings into arrays", () => {
    const userOptions = fillPluginOptions(OptionsSchema, {
      blogRouteBasePath: "blog",
      language: "en",
    });

    const normalizedOptions = normalizePluginOptions(userOptions, siteDir);

    expect(normalizedOptions.blogRouteBasePath).toEqual(["blog"]);
    expect(normalizedOptions.language).toEqual(["en"]);
  });

  test("it should strip slashes from base paths", () => {
    const userOptions = fillPluginOptions(OptionsSchema, {
      blogRouteBasePath: "/blog",
      docsRouteBasePath: "/docs",
    });

    const normalizedOptions = normalizePluginOptions(userOptions, siteDir);

    expect(normalizedOptions.blogRouteBasePath).toEqual(["blog"]);
    expect(normalizedOptions.docsRouteBasePath).toEqual(["docs"]);
  });

  test("it should resolve blog and docs directories", () => {
    const userOptions = fillPluginOptions(OptionsSchema, {
      blogDir: "blog",
      docsDir: "docs",
    });

    const normalizedOptions = normalizePluginOptions(userOptions, siteDir);

    expect(normalizedOptions.blogDir).toEqual(["/tmp/blog"]);
    expect(normalizedOptions.docsDir).toEqual(["/tmp/docs"]);
  });

  test("it should process external search endpoints", () => {
    expect(
      normalizePluginOptions(fillPluginOptions(OptionsSchema, {}), siteDir)
        .searchEndpoints
    ).toStrictEqual([]);
  });
});
