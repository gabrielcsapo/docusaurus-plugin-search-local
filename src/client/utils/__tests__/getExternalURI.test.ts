import type { SearchDocument } from "../../../types";
import { getExternalURI } from "../getExternalURI";

describe("getExternalURI", () => {
  const DEFAULT_DOC: SearchDocument = {
    // Doc index
    i: 0,

    // Doc Title
    t: "Default Doc",

    // Doc URL
    u: "/",
  };

  test("it should build an external URI for basic use case", () => {
    expect(getExternalURI(DEFAULT_DOC, "/")).toBe("/");
  });

  test("it should work with an actual doc URL", () => {
    const doc: SearchDocument = { ...DEFAULT_DOC, u: "/some-rando/location" };

    expect(getExternalURI(doc, "/")).toBe(doc.u);
  });

  test("it should build an external URI when a base URI is provided", () => {
    const baseURI = "http://www.example.com";

    // The default doc does not have a URL therefore our result should be the baseURI with a trailing "/".
    expect(getExternalURI(DEFAULT_DOC, baseURI)).toBe(
      `${baseURI}${DEFAULT_DOC.u}`
    );
  });

  test("it should combine the base URI and the doc's route to create a full URI", () => {
    const doc: SearchDocument = { ...DEFAULT_DOC, u: "/some-rando/location" };
    const baseURI = "http://www.example.com";

    expect(getExternalURI(doc, baseURI)).toBe(`${baseURI}${doc.u}`);
  });

  test("it should strip out extra slashes when building the URI", () => {
    const doc: SearchDocument = { ...DEFAULT_DOC, u: "/foo" };

    expect(getExternalURI(doc, "http://www.example.com/")).toBe(
      "http://www.example.com/foo"
    );

    expect(getExternalURI(doc, "/some-local-route/")).toBe(
      "/some-local-route/foo"
    );
  });

  test("it should strip out overlapping path parts", () => {
    const baseURI = "www.example.com/docusaurus-plugin-search-local/";
    const doc: SearchDocument = {
      ...DEFAULT_DOC,
      u: "/docusaurus-plugin-search-local/blog/welcome",
    };

    expect(getExternalURI(doc, baseURI)).toBe(
      "www.example.com/docusaurus-plugin-search-local/blog/welcome"
    );
  });

  test("it should handle a base URI ending with '/' and the document's URL does not start with a '/' ", () => {
    const baseURI = "www.example.com/docusaurus-plugin-search-local/";
    const doc: SearchDocument = {
      ...DEFAULT_DOC,
      u: "docusaurus-plugin-search-local/blog/welcome",
    };

    expect(getExternalURI(doc, baseURI)).toBe(
      "www.example.com/docusaurus-plugin-search-local/blog/welcome"
    );
  });

  test("it should handle a base URI without a trailing '/' and the document's URL starts with a '/'", () => {
    const baseURI = "www.example.com/docusaurus-plugin-search-local";
    const doc: SearchDocument = {
      ...DEFAULT_DOC,
      u: "/docusaurus-plugin-search-local/blog/welcome",
    };

    expect(getExternalURI(doc, baseURI)).toBe(
      "www.example.com/docusaurus-plugin-search-local/blog/welcome"
    );
  });

  test("it should handle a base URI without a trailing '/' and the document's URL does not start with a '/'", () => {
    const baseURI = "www.example.com/docusaurus-plugin-search-local";
    const doc: SearchDocument = {
      ...DEFAULT_DOC,
      u: "docusaurus-plugin-search-local/blog/welcome",
    };

    expect(getExternalURI(doc, baseURI)).toBe(
      "www.example.com/docusaurus-plugin-search-local/blog/welcome"
    );
  });
});
