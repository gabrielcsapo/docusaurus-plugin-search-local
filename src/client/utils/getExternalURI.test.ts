import { getExternalURI } from './getExternalURI';

describe('getExternalURI', () => {
  const DEFAULT_DOC_PATH = '/';

  test('it should build an external URI for basic use case', () => {
    expect(getExternalURI(DEFAULT_DOC_PATH, '/')).toBe('/');
  });

  test('it should work with an actual doc URL', () => {
    expect(getExternalURI('/some-rando/location', '/')).toBe(
      '/some-rando/location',
    );
  });

  test('it should build an external URI when a base URI is provided', () => {
    const baseURI = 'http://www.example.com';

    // The default doc does not have a URL therefore our result should be the baseURI with a trailing "/".
    expect(getExternalURI(DEFAULT_DOC_PATH, baseURI)).toBe(
      `${baseURI}${DEFAULT_DOC_PATH}`,
    );
  });

  test("it should combine the base URI and the doc's route to create a full URI", () => {
    expect(
      getExternalURI('/some-rando/location', 'http://www.example.com'),
    ).toBe('http://www.example.com/some-rando/location');
  });

  test('it should strip out extra slashes when building the URI', () => {
    expect(getExternalURI('/foo', 'http://www.example.com/')).toBe(
      'http://www.example.com/foo',
    );

    expect(getExternalURI('/foo', '/some-local-route/')).toBe(
      '/some-local-route/foo',
    );
  });

  test('it should strip out overlapping path parts', () => {
    expect(
      getExternalURI(
        '/docusaurus-plugin-search-local/blog/welcome',
        'www.example.com/docusaurus-plugin-search-local/',
      ),
    ).toBe('www.example.com/docusaurus-plugin-search-local/blog/welcome');
  });

  test("it should handle a base URI ending with '/' and the document's URL does not start with a '/' ", () => {
    expect(
      getExternalURI(
        'docusaurus-plugin-search-local/blog/welcome',
        'www.example.com/docusaurus-plugin-search-local/',
      ),
    ).toBe('www.example.com/docusaurus-plugin-search-local/blog/welcome');
  });

  test("it should handle a base URI without a trailing '/' and the document's URL starts with a '/'", () => {
    expect(
      getExternalURI(
        '/docusaurus-plugin-search-local/blog/welcome',
        'www.example.com/docusaurus-plugin-search-local',
      ),
    ).toBe('www.example.com/docusaurus-plugin-search-local/blog/welcome');
  });

  test("it should handle a base URI without a trailing '/' and the document's URL does not start with a '/'", () => {
    expect(
      getExternalURI(
        'docusaurus-plugin-search-local/blog/welcome',
        'www.example.com/docusaurus-plugin-search-local',
      ),
    ).toBe('www.example.com/docusaurus-plugin-search-local/blog/welcome');
  });

  test('it should de-duplicate URIs with multiple overlapping route parts', () => {
    expect(getExternalURI('/foo/bar/graphql', 'www.example.com/foo/bar/')).toBe(
      'www.example.com/foo/bar/graphql',
    );

    expect(
      getExternalURI(
        '/some-rando/location/foo',
        'https://www.foo.bar.example.com/some-rando/location/',
      ),
    ).toBe('https://www.foo.bar.example.com/some-rando/location/foo');
  });

  test('it should handle a url with same parts but not overlapping', () => {
    expect(getExternalURI('/foo/bar/graphql', 'www.example.com/foo/baz/')).toBe(
      'www.example.com/foo/baz/foo/bar/graphql',
    );

    expect(
      getExternalURI('/foo/bar/graphql', 'www.example.com/foo/bar/foo/bar'),
    ).toBe('www.example.com/foo/bar/foo/bar/graphql');

    expect(
      getExternalURI('/foo/bar/graphql', 'www.example.com/baz/foo/bar'),
    ).toBe('www.example.com/baz/foo/bar/graphql');
  });
});
