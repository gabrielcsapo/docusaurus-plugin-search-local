import React from "react";

import styles from "./SearchResultsSection.module.css";

interface SearchResultsSectionProps {
  heading: string;
}

const SearchResultsSection: React.FC<SearchResultsSectionProps> = (props) => {
  const { children, heading } = props;

  return (
    <section className={styles.container}>
      <header className={styles.header}>{heading}</header>

      {children}
    </section>
  );
};

export default SearchResultsSection;
