declare let _paq: Array<[string, string, boolean, number]>;

import React, { useEffect, useState, useRef, RefObject } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { usePluginData } from "@docusaurus/useGlobalData";

import { fetchIndexes } from "../../utils/fetchIndexes";
import { SearchSourceFactory } from "../../utils/SearchSourceFactory";
import { SearchResult } from "../../../types";
import LoadingRing from "../LoadingRing/LoadingRing";
import { IconSearch } from "./icons";
import { simpleTemplate } from "../../utils/simpleTemplate";
import SuggestionTemplate from "./SuggestionTemplate";
import styles from "./SearchModal.module.css";
import { GlobalPluginData } from "../../../docusaurus-plugin-search-local";

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

  React.useEffect(() => {
    ref.current?.addEventListener("keydown", downHandler);
    ref.current?.addEventListener("keyup", upHandler);

    return () => {
      ref.current?.removeEventListener("keydown", downHandler);
      ref.current?.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

export default function SearchModal({
  onClose,
}: SearchModalProps): React.ReactElement {
  const {
    siteConfig: { baseUrl },
  } = useDocusaurusContext();
  const {
    indexHash,
    language,
    removeDefaultStopWordFilter,
    searchResultLimits,
    translations,
  } = usePluginData<GlobalPluginData>("docusaurus-plugin-search-local");
  const [searchQuery, setSearchQuery] = useState("");
  const searchModal = useRef(null);
  const searchInput = useRef(null);
  const [searchSource, setSearchSource] =
    useState<
      (input: string, callback: (results: SearchResult[]) => void) => void
    >();
  const [searchResults, setSearchResults] = useState<SearchResult[]>();

  const [selected, setSelected] =
    useState<React.SetStateAction<SearchResult | undefined>>(undefined);
  const downPress = useKeyPress("ArrowDown", searchInput);
  const upPress = useKeyPress("ArrowUp", searchInput);
  const enterPress = useKeyPress("Enter", searchInput);
  const [cursor, setCursor] = useState<number>(0);
  const [hovered, setHovered] = useState<SearchResult | undefined>(undefined);

  useEffect(() => {
    if (searchResults?.length && downPress) {
      setCursor((prevState) =>
        prevState < searchResults?.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (searchResults?.length && upPress) {
      setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
  useEffect(() => {
    if (searchResults?.length && enterPress && cursor >= 0) {
      setSelected(searchResults[cursor]);
    }
  }, [cursor, enterPress]);
  useEffect(() => {
    if (searchResults?.length && hovered) {
      setCursor(searchResults.indexOf(hovered));
    }
  }, [hovered]);

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
      const { wrappedIndexes, zhDictionary } = await fetchIndexes(
        baseUrl,
        indexHash
      );
      setSearchSource(() =>
        SearchSourceFactory({
          wrappedIndexes,
          languages: language,
          zhDictionary,
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

        <div className={styles.suggestion}>
          {!searchQuery ? (
            <div className={styles.messageContainer}>
              <p>Please provide a search query to show results.</p>
            </div>
          ) : (
            ""
          )}
          {searchResults && searchResults?.length === 0 ? (
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
            {searchResults && searchResults?.length > 0 ? (
              <>
                <p>
                  {simpleTemplate(
                    searchResults?.length === 1
                      ? translations.count_documents_found
                      : translations.count_documents_found_plural,
                    {
                      count: searchResults?.length,
                    }
                  )}
                </p>
                {searchResults.map((item, i: number) => (
                  <SuggestionTemplate
                    key={item.document.i}
                    searchResult={item}
                    isSelected={selected === item}
                    isHovered={cursor === i}
                    setSelected={setSelected}
                    setHovered={setHovered}
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
