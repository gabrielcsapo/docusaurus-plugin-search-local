import React from "react";
import clsx from "clsx";
import { sanitizeUrl } from "@braintree/sanitize-url";
import { useHistory } from "@docusaurus/router";
import { usePluginData } from "@docusaurus/useGlobalData";
import IconExternalLink from "@theme-original/Icon/ExternalLink";

import { GlobalPluginData } from "docusaurus-plugin-search-local";
import { SearchDocument, SearchResult as ISearchResult } from "../../../types";
import { highlight } from "../../utils/highlight";
import { highlightStemmed } from "../../utils/highlightStemmed";
import { getStemmedPositions } from "../../utils/getStemmedPositions";
import { getExternalURI } from "../../utils/getExternalURI";
import {
  IconTitle,
  IconHeading,
  IconContent,
  IconAction,
  IconTreeInter,
  IconTreeLast,
} from "./icons";

import styles from "./index.module.css";

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

function buildDestinationQueryParams(tokens: string[]): string {
  if (tokens.length === 0) {
    return "";
  }

  const params = new URLSearchParams();

  tokens.forEach((token) => {
    params.append(SEARCH_PARAM_HIGHLIGHT, token);
  });

  return params.toString();
}

function handleExternalSearchClick(
  doc: SearchDocument,
  tokens: string[],
  externalUriBase: string,
  shouldHighlight: boolean
) {
  const queryParams = shouldHighlight
    ? buildDestinationQueryParams(tokens)
    : "";
  const externalURI = `${getExternalURI(
    doc.u,
    externalUriBase
  )}?${queryParams}`;
  const uri = sanitizeUrl(externalURI);

  const tab = window.open(uri, "_blank");

  if (tab) {
    // Set opener window to null to prevent tabnabbing
    tab.opener = null;
  }
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

  const { searchResultContextMaxLength, highlightSearchTermsOnTargetPage } =
    usePluginData("docusaurus-plugin-search-local") as GlobalPluginData;
  const history = useHistory();
  const isTitle = type === 0;
  const isHeading = type === 1;

  const _onClick = () => {
    // If there is a search source defined, open the link externally.
    if (searchSource.length) {
      handleExternalSearchClick(
        document,
        tokens,
        searchSource,
        highlightSearchTermsOnTargetPage
      );
      return;
    }

    const { u, h } = document;

    let url = sanitizeUrl(u);
    if (tokens.length > 0 && highlightSearchTermsOnTargetPage) {
      url += `?${buildDestinationQueryParams(tokens)}`;
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
      className={clsx(styles.searchResult, isHovered ? styles.cursor : "")}
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

      {searchSource === "" ? (
        <span className={styles.hitAction}>
          <IconAction />
        </span>
      ) : (
        <IconExternalLink height={15} width={15} />
      )}
    </div>
  );
};

export default SearchResult;
