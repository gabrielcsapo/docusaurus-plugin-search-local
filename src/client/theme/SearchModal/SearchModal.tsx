declare let _paq: Array<[string, string, boolean, number]>;

import React, { useEffect, useState, useRef, RefObject } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";
import Link from "@docusaurus/Link";

import {
  ExternalSourceConfig,
  GlobalPluginData,
} from "docusaurus-plugin-search-local";
import { fetchIndexes } from "../../utils/fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SearchResult, SearchSourceFn } from "../../../types";
import LoadingRing from "../LoadingRing/LoadingRing";
import { IconSearch } from "./icons";
import SearchResultList from "./SearchResultList";
import SearchResultsSection from "./SearchResultsSection";

import styles from "./index.module.css";

type ExternalSearchResults = ExternalSourceConfig & {
  results: SearchResult[];
};

type ExternalSearchSource = ExternalSourceConfig & {
  search: SearchSourceFn;
};

interface SearchModalProps {
  onClose: () => void;
}

const useKeyPress = function (
  targetKey: string,
  ref: RefObject<HTMLInputElement>
) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    ref.current?.addEventListener("keydown", downHandler);
    ref.current?.addEventListener("keyup", upHandler);

    return () => {
      ref.current?.removeEventListener("keydown", downHandler);
      ref.current?.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

const SearchModal: React.FC<SearchModalProps> = ({
  onClose,
}: SearchModalProps) => {
  const {
    siteConfig: { baseUrl, title },
  } = useDocusaurusContext();
  const {
    indexHash,
    removeDefaultStopWordFilter,
    searchResultLimits,
    translations,
    externalSearchSources: externalSourceConfigs,
  } = usePluginData<GlobalPluginData>("docusaurus-plugin-search-local");
  const [searchQuery, setSearchQuery] = useState("");
  const searchModal = useRef(null);
  const searchInput = useRef(null);
  const [searchSource, setSearchSource] = useState<SearchSourceFn>();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<SearchResult | undefined>(undefined);
  const downPress = useKeyPress("ArrowDown", searchInput);
  const upPress = useKeyPress("ArrowUp", searchInput);
  const enterPress = useKeyPress("Enter", searchInput);
  const [cursor, setCursor] = useState<number>(0);
  const [hovered, setHovered] = useState<SearchResult | undefined>(undefined);

  // External Search Source Data
  const [externalSearchSources, setExternalSearchSources] = useState<
    ExternalSearchSource[]
  >([]);

  const [externalSearchResults, setExternalSearchResults] = useState<
    ExternalSearchResults[]
  >([]);

  useEffect(() => {
    if (allSearchResults.length && downPress) {
      setCursor((prevState) =>
        prevState < allSearchResults.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);

  useEffect(() => {
    if (allSearchResults.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);

  useEffect(() => {
    if (allSearchResults.length && enterPress && cursor >= 0) {
      setSelected(allSearchResults[cursor]);
    }
  }, [cursor, enterPress]);

  useEffect(() => {
    if (allSearchResults.length && hovered) {
      setCursor(allSearchResults.indexOf(hovered));
    }
  }, [hovered]);

  useEffect(() => {
    if (searchSource) {
      if (searchQuery) {
        searchSource(searchQuery, (results) => {
          setSearchResults(results);
        });
      } else {
        setSearchResults([]);
      }
    }

    // `updateSearchPath` should not be in the deps,
    // otherwise will cause call stack overflow.
  }, [searchQuery, searchSource]);

  useEffect(() => {
    async function doFetchIndexes() {
      const { wrappedIndexes } = await fetchIndexes(baseUrl, indexHash);
      setSearchSource(() =>
        SearchSourceFactory({
          wrappedIndexes,
          removeDefaultStopWordFilter,
          resultsLimit: searchResultLimits,
          onResults: (query, results) => {
            // TODO: needs to be abstracted to be able to handle any site analytics
            if (typeof _paq !== "undefined" && _paq && _paq?.push) {
              _paq.push([
                "trackSiteSearch",
                query, // Search keyword searched for
                false, // Search category selected in your search engine. If you do not need this, set to false
                results.length, // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
              ]);
            }
          },
        })
      );
    }
    doFetchIndexes();
  }, [baseUrl]);

  useEffect(() => {
    async function fetchExternalSources() {
      const _externalSearchSources: ExternalSearchSource[] = [];

      externalSourceConfigs.forEach(async (externalSourceConfig) => {
        try {
          const { wrappedIndexes } = await fetchIndexes(
            externalSourceConfig.uri
          );

          _externalSearchSources.push({
            ...externalSourceConfig,
            search: SearchSourceFactory({
              wrappedIndexes,
              removeDefaultStopWordFilter,
              resultsLimit: searchResultLimits,
              onResults: (query, results) => {
                // TODO: needs to be abstracted to be able to handle any site analytics
                if (typeof _paq !== "undefined" && _paq && _paq?.push) {
                  _paq.push([
                    "trackSiteSearch",
                    query, // Search keyword searched for
                    false, // Search category selected in your search engine. If you do not need this, set to false
                    results.length, // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
                  ]);
                }
              },
            }),
          });
        } catch {
          console.warn(
            `Unable to fetch search index for ${externalSourceConfig.heading} from: ${externalSourceConfig.uri}`
          );
        }
      });

      setExternalSearchSources(_externalSearchSources);
    }

    fetchExternalSources();
  }, [externalSourceConfigs, removeDefaultStopWordFilter, searchResultLimits]);

  useEffect(() => {
    if (searchQuery === "") {
      setExternalSearchResults([]);
      return;
    }

    const _externalSearchResults: ExternalSearchResults[] = [];

    externalSearchSources.forEach((externalSearchSource) => {
      externalSearchSource.search(searchQuery, (results) => {
        // Only add external search results if we found a result in its index.
        if (results.length > 0) {
          _externalSearchResults.push({
            results,
            heading: externalSearchSource.heading,
            uri: externalSearchSource.uri,
          });
        }
      });
    });

    setExternalSearchResults(_externalSearchResults);
  }, [searchQuery, externalSearchSources]);

  const allSearchResults: SearchResult[] = [
    ...searchResults,
    ...externalSearchResults.flatMap(({ results }) => results),
  ];

  let cursorOffset = searchResults.length;

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
            ref={searchInput}
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

        <div className={styles.searchResultsContainer}>
          {!searchQuery ? (
            <div className={styles.messageContainer}>
              <p>Please provide a search query to show results.</p>
            </div>
          ) : (
            ""
          )}
          {searchResults.length === 0 ? (
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
            <SearchResultsSection heading={title}>
              <SearchResultList
                results={searchResults}
                currentSelection={selected}
                cursor={cursor}
                onSearchResultClick={onClose}
                setHovered={setHovered}
                setSelected={setSelected}
              />
            </SearchResultsSection>
          )}

          {externalSearchResults.map((esr, idx) => {
            const t = (
              <SearchResultsSection
                key={idx}
                heading={esr.heading}
                headingLink={esr.uri}
                sectionQuery={searchQuery}
              >
                <SearchResultList
                  results={esr.results}
                  currentSelection={selected}
                  cursor={cursor}
                  cursorOffset={cursorOffset}
                  searchSource={esr.uri}
                  onSearchResultClick={onClose}
                  setHovered={setHovered}
                  setSelected={setSelected}
                />
              </SearchResultsSection>
            );

            cursorOffset += esr.results.length;

            return t;
          })}

          {allSearchResults.length > 0 && (
            <section className={styles.searchResultsContainerFooter}>
              <Link to={`/search?q=${searchQuery}`} onClick={onClose}>
                See All Results
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
