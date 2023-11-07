import * as React from "react";

import { SearchResult as ISearchResult } from "../../../types";
import SearchResult from "./SearchResult";

export interface SearchResultListProps {
  currentSelection?: ISearchResult;
  cursor: number;
  cursorOffset?: number;
  results: ISearchResult[];
  searchSource?: string;
  onSearchResultClick: () => void;
  setHovered: (searchResult: ISearchResult | undefined) => void;
  setSelected: (searchResult: ISearchResult | undefined) => void;
}

const SearchResultList: React.FC<SearchResultListProps> = (props) => {
  const {
    currentSelection,
    cursor,
    cursorOffset = 0,
    results,
    searchSource = "",
    onSearchResultClick,
    setHovered,
    setSelected,
  } = props;

  // Display nothing if we are not provided results.
  if (results.length === 0) {
    return null;
  }

  return (
    <>
      {results.map((item, idx) => (
        <SearchResult
          key={item.document.i}
          searchResult={item}
          isSelected={currentSelection === item}
          isHovered={cursor === idx + cursorOffset}
          searchSource={searchSource}
          setSelected={setSelected}
          setHovered={setHovered}
          onClick={onSearchResultClick}
        />
      ))}
    </>
  );
};

export default SearchResultList;
