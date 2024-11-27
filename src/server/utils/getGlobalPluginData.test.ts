import fixturify from 'fixturify';
import tmp from 'tmp';
import { describe, test, expect, vi } from 'vitest';

import type { PluginConfig } from '../../types';
import { getGlobalPluginData } from './getGlobalPluginData';
import * as indexHash from './getIndexHash';

describe('getGlobalPluginData', () => {
  const baselinePluginConfig: PluginConfig = {
    id: 'foo',
    indexDocs: false,
    indexBlog: false,
    indexPages: false,
    docsRouteBasePath: ['docs'],
    blogRouteBasePath: ['blog'],
    hashed: false,
    docsDir: ['docs'],
    blogDir: ['blog'],
    removeDefaultStopWordFilter: false,
    highlightSearchTermsOnTargetPage: false,
    searchResultLimits: 8,
    searchResultContextMaxLength: 50,
    ignoreFiles: [],
    translations: {
      search_placeholder: 'Search',
      see_all_results: 'See all results',
      no_results: 'No results.',
      search_results_for: 'Search results for "{{ keyword }}"',
      search_the_documentation: 'Search the documentation',
      count_documents_found_plural: '{{ count }} documents found',
      count_documents_found: '{{ count }} document found',
      no_documents_were_found: 'No documents were found',
    },
    externalSearchSources: [],
  };

  let tmpLocation: tmp.DirResult;
  let projectFixture;

  beforeEach(() => {
    tmpLocation = tmp.dirSync({ unsafeCleanup: true });
    projectFixture = {
      blog: {
        'hello-blog.md': `
          ---
          sidebar_position: 1
          ---

          # Hello Blog

          This is a dummy blog post.
        `,
      },
      docs: {
        'hello-world.md': `
          ---
          sidebar_position: 1
          ---

          # Hello World

          This is a dummy doc.
        `,
      },
    };

    fixturify.writeSync(tmpLocation.name, projectFixture);
  });

  afterEach(() => {
    tmpLocation.removeCallback();
  });

  test('it should generate global plugin data', () => {
    const config: PluginConfig = { ...baselinePluginConfig };

    expect(getGlobalPluginData(config)).toEqual({
      externalSearchSources: config.externalSearchSources,
      indexHash: null,
      highlightSearchTermsOnTargetPage: config.highlightSearchTermsOnTargetPage,
      removeDefaultStopWordFilter: config.removeDefaultStopWordFilter,
      searchResultContextMaxLength: config.searchResultContextMaxLength,
      searchResultLimits: config.searchResultLimits,
      translations: config.translations,
    });
  });

  test('it should generate an index hash when enabled', () => {
    vi.spyOn(indexHash, 'getIndexHash').mockReturnValue('CONSISTENT_HASH');

    const config: PluginConfig = {
      ...baselinePluginConfig,
      blogDir: [`${tmpLocation.name}/blog`],
      docsDir: [`${tmpLocation.name}/docs`],
      hashed: true,
      indexDocs: true,
      indexBlog: true,
    };

    expect(getGlobalPluginData(config)).toMatchSnapshot();
  });

  test('it should only index blog when enabled', () => {
    vi.spyOn(indexHash, 'getIndexHash').mockReturnValue('CONSISTENT_HASH');

    const config: PluginConfig = {
      ...baselinePluginConfig,
      blogDir: [`${tmpLocation.name}/blog`],
      hashed: true,
      indexBlog: true,
    };

    expect(getGlobalPluginData(config)).toMatchSnapshot();
  });

  test('it should only index docs when enabled', () => {
    vi.spyOn(indexHash, 'getIndexHash').mockReturnValue('CONSISTENT_HASH');

    const config: PluginConfig = {
      ...baselinePluginConfig,
      docsDir: [`${tmpLocation.name}/docs`],
      hashed: true,
      indexDocs: true,
    };

    expect(getGlobalPluginData(config)).toMatchSnapshot();
  });
});
