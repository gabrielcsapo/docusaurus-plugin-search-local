import * as React from "react";
import Link from "@docusaurus/Link";
import IconExternalLink from "@theme-original/Icon/ExternalLink";

import { getExternalURI } from "../../utils/getExternalURI";

import styles from "./index.module.css";

interface SearchResultsSectionProps {
  heading: string;
  headingLink?: string;
  sectionQuery?: string;
}

function generateSectionLink(headingLink: string, query: string): string {
  const qParams = new URLSearchParams([["q", query]]);

  return `${getExternalURI("/search", headingLink)}?${qParams.toString()}`;
}

const SearchResultsSection: React.FC<
  React.PropsWithChildren<SearchResultsSectionProps>
> = (props) => {
  const { children, heading, headingLink, sectionQuery = "" } = props;

  return (
    <section className={styles.searchResultsSection}>
      <header className={styles.searchResultsSectionHeader}>
        {headingLink ? (
          <Link
            to={generateSectionLink(headingLink, sectionQuery)}
            target="_blank"
          >
            {heading}
            <IconExternalLink height={13} width={13} />
          </Link>
        ) : (
          heading
        )}
      </header>

      {children}
    </section>
  );
};

export default SearchResultsSection;
