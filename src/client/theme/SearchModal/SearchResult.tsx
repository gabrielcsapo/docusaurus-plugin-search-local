import React from "react";
import Mark from "mark.js";
import clsx from "clsx";
import { useHistory } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";

import { GlobalPluginData } from "docusaurus-plugin-search-local";
import { SearchDocument, SearchResult as ISearchResult } from "../../../types";
import { highlight } from "../../utils/highlight";
import { highlightStemmed } from "../../utils/highlightStemmed";
import { getStemmedPositions } from "../../utils/getStemmedPositions";
import {
  IconTitle,
  IconHeading,
  IconContent,
  IconAction,
  IconTreeInter,
  IconTreeLast,
} from "./icons";

import styles from "./SearchResult.module.css";

const SEARCH_PARAM_HIGHLIGHT = "_highlight";

interface SuggestionTemplateProps {
  isSelected: boolean;
  isHovered: boolean;
  searchResult: ISearchResult;
  searchSource: string;
  setSelected: (searchResult: ISearchResult | undefined) => void;
  setHovered: (searchResult: ISearchResult | undefined) => void;
  onClick: () => void;
}

function handleExternalSearchClick(
  doc: SearchDocument,
  externalUriBase: string
) {
  const { u: docRoute } = doc;

  // TODO: use the doc's "u" field and the uri provided to combine for external url

  console.debug({
    docRoute,
    externalUriBase,
  });
}

const SearchResult: React.FC<SuggestionTemplateProps> = (props) => {
  const {
    isSelected,
    isHovered,
    searchResult,
    searchSource,
    setSelected,
    setHovered,
    onClick,
  } = props;

  const {
    document,
    type,
    page,
    metadata,
    tokens,
    isInterOfTree,
    isLastOfTree,
  } = searchResult;

  const { searchResultContextMaxLength } = usePluginData<GlobalPluginData>(
    "docusaurus-plugin-search-local"
  );
  const history = useHistory();
  const isTitle = type === 0;
  const isHeading = type === 1;

  const _onClick = () => {
    if (searchSource.length) {
      handleExternalSearchClick(document, searchSource);
      return;
    }

    const { u, h } = document;

    let url = u;
    if (Mark && tokens.length > 0) {
      const params = new URLSearchParams();
      for (const token of tokens) {
        params.append(SEARCH_PARAM_HIGHLIGHT, token);
      }
      url += `?${params.toString()}`;
    }
    if (h) {
      url += h;
    }

    history.push(url);
    onClick();
  };

  // TODO: figure out if this is necessary at all. OnClick happens for on the element and shouldnt ever propogate down here.
  if (isSelected && isHovered) {
    // reset the selected as we are going to navigate
    setSelected(undefined);
    _onClick();
  }

  return (
    <div
      className={clsx(styles.suggestion, isHovered ? styles.cursor : "")}
      onMouseEnter={() => setHovered(searchResult)}
      onMouseLeave={() => setHovered(undefined)}
      onClick={_onClick}
    >
      {isInterOfTree || isLastOfTree ? (
        <span className={styles.hitTree}>
          {isInterOfTree ? <IconTreeInter /> : <IconTreeLast />}
        </span>
      ) : (
        ""
      )}
      <span className={styles.hitIcon}>
        {isTitle ? (
          <IconTitle />
        ) : isHeading ? (
          <IconHeading />
        ) : (
          <IconContent />
        )}
      </span>
      <span className={styles.hitWrapper}>
        <span
          className={styles.hitTitle}
          dangerouslySetInnerHTML={{
            __html: highlightStemmed(
              document.t,
              getStemmedPositions(metadata, "t"),
              tokens,
              searchResultContextMaxLength
            ),
          }}
        />

        {isTitle ? (
          <span className={styles.hitPath}>{document.u}</span>
        ) : (
          <span
            className={styles.hitPath}
            dangerouslySetInnerHTML={{
              __html: highlight(
                (page as SearchDocument).t ||
                  // Todo(weareoutman): This is for EasyOps only.
                  // istanbul ignore next
                  (document.u.startsWith("/docs/api-reference/")
                    ? "API Reference"
                    : ""),
                tokens
              ),
            }}
          />
        )}
      </span>
      <span className={styles.hitAction}>
        <IconAction />
      </span>
    </div>
  );
};

export default SearchResult;
