import React from "react";
import { useHistory } from "@docusaurus/router";

import { SearchDocument, SearchResult } from "../../../shared/interfaces";
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

import { Mark } from "../../utils/proxiedGenerated";

import styles from "./SuggestionTemplate.module.css";

const SEARCH_PARAM_HIGHLIGHT = "_highlight";

interface SuggestionTemplateProps
  extends Omit<SearchResult, "score" | "index"> {
  onClick: () => void;
}

export default function SuggestionTemplate({
  document,
  type,
  page,
  metadata,
  tokens,
  isInterOfTree,
  isLastOfTree,
  onClick,
}: SuggestionTemplateProps): React.ReactElement {
  const history = useHistory();
  const isTitle = type === 0;
  const isHeading = type === 1;

  const _onClick = () => {
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

  return (
    <div className={styles.suggestion} onClick={_onClick}>
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
              tokens
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
}
