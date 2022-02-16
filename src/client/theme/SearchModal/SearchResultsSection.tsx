import React from "react";

import styles from "./index.module.css";

interface SearchResultsSectionProps {
  heading: string;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = (props) => {
  const { children, heading } = props;

  return (
    <section className={styles.searchResultsSection}>
      <header className={styles.searchResultsSectionHeader}>{heading}</header>

      {children}
    </section>
  );
};

export default SearchResultsSection;
