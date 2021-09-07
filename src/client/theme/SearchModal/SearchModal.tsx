declare var _paq: Array<[string, string, boolean, number]>;

import React, { useEffect, useMemo, useState, useRef } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import { fetchIndexes } from "../SearchBar/fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SearchResult } from "../../../shared/interfaces";
import LoadingRing from "../LoadingRing/LoadingRing";
import { IconSearch } from "./icons";
import { simpleTemplate } from "../../utils/simpleTemplate";

import { searchResultLimits, translations } from "../../utils/proxiedGenerated";

import SuggestionTemplate from "./SuggestionTemplate";

import styles from "./SearchModal.module.css";

const SEARCH_PARAM_HIGHLIGHT = "_highlight";

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({
  onClose,
}: SearchModalProps): React.ReactElement {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const [searchQuery, setSearchQuery] = useState("");
  const searchModal = useRef(null);
  const [searchSource, setSearchSource] = useState<
    (input: string, callback: (results: SearchResult[]) => void) => void
  >();
  const [searchResults, setSearchResults] = useState<SearchResult[]>();

  useEffect(() => {
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
  }, [searchQuery, searchSource]);

  useEffect(() => {
    async function doFetchIndexes() {
      const { wrappedIndexes, zhDictionary } = await fetchIndexes(baseUrl);
      setSearchSource(() =>
        SearchSourceFactory(
          wrappedIndexes,
          zhDictionary,
          searchResultLimits,
          (query, results) => {
            // TODO: needs to be abstracted to be able to handle any site analytics
            if (typeof _paq !== "undefined" && _paq && _paq?.push) {
              _paq.push([
                "trackSiteSearch",
                query, // Search keyword searched for
                false, // Search category selected in your search engine. If you do not need this, set to false
                results.length, // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
              ]);
            }
          }
        )
      );
    }
    doFetchIndexes();
  }, [baseUrl]);

  return (
    <div
      className={styles.searchModal}
      onClick={(ev) => {
        if (ev.target === searchModal.current) {
          onClose();
        }
      }}
      ref={searchModal}
    >
      <div className={styles.searchModalContainer}>
        <div className={styles.searchInputContainer}>
          <label>
            <IconSearch />
          </label>
          <input
            type="search"
            name="q"
            className={styles.searchInput}
            aria-label="Search"
            placeholder="Search docs"
            onChange={(ev) => {
              setSearchQuery(ev.target.value);
            }}
            value={searchQuery}
            autoComplete="off"
            autoFocus
          />
        </div>
        {!searchSource && searchQuery && (
          <div className={styles.loadingContainer}>
            <LoadingRing />
          </div>
        )}

        <div className={styles.suggestion}>
          {!searchQuery ? (
            <div className={styles.messageContainer}>
              <p>Please provide a search query to show results.</p>
            </div>
          ) : (
            ""
          )}
          {searchResults && searchResults.length === 0 ? (
            process.env.NODE_ENV === "production" ? (
              <div className={styles.messageContainer}>
                <p>{translations.no_documents_were_found}</p>
              </div>
            ) : (
              <div className={styles.messageContainer}>
                <p>
                  ⚠️ The search index is only available when you run docusaurus
                  build!
                </p>
              </div>
            )
          ) : (
            ""
          )}

          <section className={styles.searchResultsContainer}>
            {searchResults && searchResults.length > 0 ? (
              <>
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
                {searchResults.map((item) => (
                  <SuggestionTemplate
                    key={item.document.i}
                    {...item}
                    onClick={onClose}
                  />
                ))}
              </>
            ) : (
              ""
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
