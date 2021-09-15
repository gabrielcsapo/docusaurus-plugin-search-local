---
sidebar_position: 1
---

# Getting started

Let's discover how to install and configure `docusaurus-plugin-search-local`

## Installation

```shell
yarn install docusaurus-plugin-search-local
```

## Configuration

```js title=docusaurus.config.js
{
    plugins: [
    [
      require.resolve("docusaurus-plugin-search-local"),
      {
        ...options
      },
    ],
  ],
}
```

### Options

| Name                             | Type                                     | Default      | Description                                                                                                                                  |
| -------------------------------- | ---------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| indexDocs                        | boolean                                  | `true`       | Whether to index docs.                                                                                                                       |
| indexBlog                        | boolean                                  | `true`       | Whether to index blog.                                                                                                                       |
| indexPages                       | boolean                                  | `false`      | Whether to index pages.                                                                                                                      |
| docsRouteBasePath                | string \| string[]                       | `"/docs"`    | Base route path(s) of docs. Slash at beginning is not required.                                                                              |
| blogRouteBasePath                | string \| string[]                       | `"/blog"`    | Base route path(s) of blog. Slash at beginning is not required.                                                                              |
| language                         | string \| string[]                       | `"en"`       | All [lunr-languages](https://github.com/MihaiValentin/lunr-languages) supported languages, + `zh` 🔥.                                        |
| hashed                           | boolean                                  | `false`      | Whether to add a hashed query when fetching index (based on the content hash of all indexed `*.md` in `docsDir` and `blogDir` if applicable) |
| docsDir                          | string \| string[]                       | `"docs"`     | The dir(s) of docs to get the content hash, it's relative to the dir of your project.                                                        |
| blogDir                          | string \| string[]                       | `"blog"`     | Just like the `docsDir` but applied to blog.                                                                                                 |
| removeDefaultStopWordFilter      | boolean                                  | `false`      | Sometimes people (E.g., us) want to keep the English stop words as indexed, since they maybe are relevant in programming docs.               |
| highlightSearchTermsOnTargetPage | boolean                                  | `false`      | Highlight search terms on target page.                                                                                                       |
| searchResultLimits               | number                                   | `8`          | Limit the search results.                                                                                                                    |
| searchResultContextMaxLength     | number                                   | `50`         | Set the max length of characters of each search result to show.                                                                              |
| translations                     | TranslationMap                           | -            | Set translations of this plugin, see [docs below](#translations).                                                                            |
| ignoreFiles                      | string \| RegExp \| (string \| RegExp)[] | /**meta**\$/ | Set the match rules to ignore some files.                                                                                                    |
