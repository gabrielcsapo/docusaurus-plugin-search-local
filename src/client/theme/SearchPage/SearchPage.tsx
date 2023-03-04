import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { usePluginData } from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';

import { GlobalPluginData } from 'docusaurus-plugin-search-local';
import useSearchQuery from '../hooks/useSearchQuery';
import { fetchIndexes } from '../../utils/fetchIndexes';
import { SearchSourceFactory } from '../../utils/SearchSourceFactory';
import { SearchAnalyticsFactory } from '../../utils/SearchAnalyticsFactory';
import { SearchDocument, SearchResult, SearchSourceFn } from '../../../types';
import { highlight } from '../../utils/highlight';
import { highlightStemmed } from '../../utils/highlightStemmed';
import { getStemmedPositions } from '../../utils/getStemmedPositions';
import LoadingRing from '../LoadingRing/LoadingRing';
import { simpleTemplate } from '../../utils/simpleTemplate';
import ErrorBoundary from '../ErrorBoundary';

import styles from './SearchPage.module.css';

export default function SearchPage(): React.ReactElement {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const { indexHash, removeDefaultStopWordFilter, translations } =
    usePluginData('docusaurus-plugin-search-local') as GlobalPluginData;
  const { searchValue, updateSearchPath } = useSearchQuery();
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [searchSource, setSearchSource] = useState<SearchSourceFn>();
  const [searchResults, setSearchResults] = useState<SearchResult[]>();

  const pageTitle = useMemo(
    () =>
      searchQuery
        ? simpleTemplate(translations.search_results_for, {
            keyword: searchQuery,
          })
        : translations.search_the_documentation,
    [
      searchQuery,
      translations.search_results_for,
      translations.search_the_documentation,
    ]
  );

  useEffect(() => {
    updateSearchPath(searchQuery);

    if (searchSource) {
      if (searchQuery) {
        searchSource(searchQuery, (results) => {
          setSearchResults(results);
        });
      } else {
        setSearchResults(undefined);
      }
    }

    // `updateSearchPath` should not be in the deps,
    // otherwise will cause call stack overflow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, searchSource]);

  const handleSearchInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  useEffect(() => {
    async function doFetchIndexes() {
      const { wrappedIndexes } = await fetchIndexes(baseUrl, indexHash);
      setSearchSource(() =>
        SearchSourceFactory({
          wrappedIndexes,
          removeDefaultStopWordFilter,
          resultsLimit: 100,
          onResults: SearchAnalyticsFactory(),
        })
      );
    }
    doFetchIndexes();
  }, [baseUrl, indexHash, removeDefaultStopWordFilter]);

  return (
    <Layout>
      <Head>
        {/*
          We should not index search pages
          See https://github.com/facebook/docusaurus/pull/3233
        */}
        <meta property='robots' content='noindex, follow' />
      </Head>

      <ErrorBoundary>
        <div className='container margin-vert--lg'>
          <h1>{pageTitle}</h1>

          <input
            type='search'
            name='q'
            className={styles.searchQueryInput}
            aria-label='Search'
            onChange={handleSearchInputChange}
            value={searchQuery}
            autoComplete='off'
            autoFocus
          />

          {!searchSource && searchQuery && (
            <div>
              <LoadingRing />
            </div>
          )}

          {searchResults &&
            (searchResults.length > 0 ? (
              <p>
                {simpleTemplate(
                  searchResults.length === 1
                    ? translations.count_documents_found
                    : translations.count_documents_found_plural,
                  {
                    count: searchResults.length,
                  }
                )}
              </p>
            ) : process.env.NODE_ENV === 'production' ? (
              <p>{translations.no_documents_were_found}</p>
            ) : (
              <p>
                ⚠️ The search index is only available when you run docusaurus
                build!
              </p>
            ))}

          <section>
            {searchResults &&
              searchResults.map((item) => (
                <SearchResultItem key={item.document.i} searchResult={item} />
              ))}
          </section>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}

function SearchResultItem({
  searchResult: { document, type, page, tokens, metadata },
}: {
  searchResult: SearchResult;
}): React.ReactElement {
  const isTitle = type === 0;
  const isContent = type === 2;
  const pathItems = (
    (isTitle ? document.b : (page as SearchDocument).b) as string[]
  ).slice();
  const articleTitle = (isContent ? document.s : document.t) as string;
  if (!isTitle) {
    pathItems.push((page as SearchDocument).t);
  }
  return (
    <article className={styles.searchResultItem}>
      <h2>
        <Link
          to={document.u + (document.h || '')}
          dangerouslySetInnerHTML={{
            __html: isContent
              ? highlight(articleTitle, tokens)
              : highlightStemmed(
                  articleTitle,
                  getStemmedPositions(metadata, 't'),
                  tokens,
                  100
                ),
          }}
        ></Link>
      </h2>
      {pathItems.length > 0 && (
        <p className={styles.searchResultItemPath}>{pathItems.join(' › ')}</p>
      )}
      {isContent && (
        <p
          className={styles.searchResultItemSummary}
          dangerouslySetInnerHTML={{
            __html: highlightStemmed(
              document.t,
              getStemmedPositions(metadata, 't'),
              tokens,
              100
            ),
          }}
        />
      )}
    </article>
  );
}
