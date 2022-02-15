import React from "react";
import { usePluginData } from "@docusaurus/useGlobalData";

import { GlobalPluginData } from "docusaurus-plugin-search-local";
import { SearchResult as ISearchResult } from "../../../types";
import SearchResult from "./SearchResult";
import { simpleTemplate } from "../../utils/simpleTemplate";

export interface SearchResultListProps {
  currentSelection?: ISearchResult;
  cursor: number;
  results: ISearchResult[];
  onSearchResultClick: () => void;
  setHovered: (searchResult: ISearchResult | undefined) => void;
  setSelected: (searchResult: ISearchResult | undefined) => void;
}

const SearchResultList: React.FC<SearchResultListProps> = (props) => {
  const {
    currentSelection,
    cursor,
    results,
    onSearchResultClick,
    setHovered,
    setSelected,
  } = props;
  const { translations } = usePluginData<GlobalPluginData>(
    "docusaurus-plugin-search-local"
  );

  // Display nothing if we are not provided results.
  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <p>
        {simpleTemplate(
          results.length === 1
            ? translations.count_documents_found
            : translations.count_documents_found_plural,
          {
            count: results.length,
          }
        )}
      </p>
      {results.map((item, i: number) => (
        <SearchResult
          key={item.document.i}
          searchResult={item}
          isSelected={currentSelection === item}
          isHovered={cursor === i}
          setSelected={setSelected}
          setHovered={setHovered}
          onClick={onSearchResultClick}
        />
      ))}
    </>
  );
};

export default SearchResultList;
