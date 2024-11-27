import type {
  Options,
  PluginOptions,
  TranslationMap,
} from 'docusaurus-plugin-search-local';
import { Joi } from '@docusaurus/utils-validation';
import type { OptionValidationContext } from '@docusaurus/types';

export const DEFAULT_OPTIONS: Omit<PluginOptions, 'id'> = {
  indexDocs: true,
  indexBlog: true,
  indexPages: false,
  docsRouteBasePath: ['docs'],
  blogRouteBasePath: ['blog'],
  hashed: false,
  docsDir: ['docs'],
  blogDir: ['blog'],
  removeDefaultStopWordFilter: false,
  highlightSearchTermsOnTargetPage: false,
  searchResultLimits: 5,
  searchResultContextMaxLength: 50,
  ignoreFiles: [],
  translations: {
    search_placeholder: 'Search',
    see_all_results: 'See all results',
    no_results: 'No results.',
    search_results_for: 'Search results for "{{ keyword }}"',
    search_the_documentation: 'Search the documentation',
    count_documents_found_plural: '{{ count }} documents found',
    count_documents_found: '{{ count }} document found',
    no_documents_were_found: 'No documents were found',
  },
  externalSearchSources: [],
};

const isStringOrArrayOfStrings = Joi.alternatives().try(
  Joi.string(),
  Joi.array().items(Joi.string()),
);

const isArrayOfStringsOrRegExpsOrStringOrRegExp = Joi.alternatives().try(
  Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object().regex())),
  Joi.string(),
  Joi.object().regex(),
);

export const OptionsSchema = Joi.object<PluginOptions>({
  indexDocs: Joi.boolean().default(DEFAULT_OPTIONS.indexDocs),
  indexBlog: Joi.boolean().default(DEFAULT_OPTIONS.indexBlog),
  indexPages: Joi.boolean().default(DEFAULT_OPTIONS.indexPages),
  docsRouteBasePath: isStringOrArrayOfStrings.default(
    DEFAULT_OPTIONS.docsRouteBasePath,
  ),
  blogRouteBasePath: isStringOrArrayOfStrings.default(
    DEFAULT_OPTIONS.blogRouteBasePath,
  ),
  hashed: Joi.boolean().default(DEFAULT_OPTIONS.hashed),
  docsDir: isStringOrArrayOfStrings.default(DEFAULT_OPTIONS.docsDir),
  blogDir: isStringOrArrayOfStrings.default(DEFAULT_OPTIONS.blogDir),
  removeDefaultStopWordFilter: Joi.boolean().default(
    DEFAULT_OPTIONS.removeDefaultStopWordFilter,
  ),
  highlightSearchTermsOnTargetPage: Joi.boolean().default(
    DEFAULT_OPTIONS.highlightSearchTermsOnTargetPage,
  ),
  searchResultLimits: Joi.number().default(DEFAULT_OPTIONS.searchResultLimits),
  searchResultContextMaxLength: Joi.number().default(
    DEFAULT_OPTIONS.searchResultContextMaxLength,
  ),
  ignoreFiles: isArrayOfStringsOrRegExpsOrStringOrRegExp.default(
    DEFAULT_OPTIONS.ignoreFiles,
  ),
  translations: Joi.object<TranslationMap>({
    search_placeholder: Joi.string().default(
      DEFAULT_OPTIONS.translations.search_placeholder,
    ),
    see_all_results: Joi.string().default(
      DEFAULT_OPTIONS.translations.see_all_results,
    ),
    no_results: Joi.string().default(DEFAULT_OPTIONS.translations.no_results),
    search_results_for: Joi.string().default(
      DEFAULT_OPTIONS.translations.search_results_for,
    ),
    search_the_documentation: Joi.string().default(
      DEFAULT_OPTIONS.translations.search_the_documentation,
    ),
    count_documents_found_plural: Joi.string().default(
      (parent) =>
        parent.count_documents_found ??
        DEFAULT_OPTIONS.translations.count_documents_found_plural,
    ),
    count_documents_found: Joi.string().default(
      DEFAULT_OPTIONS.translations.count_documents_found,
    ),
    no_documents_were_found: Joi.string().default(
      DEFAULT_OPTIONS.translations.no_documents_were_found,
    ),
  })
    .default()
    .unknown(false),
  externalSearchSources: Joi.array()
    .items(
      Joi.object({
        heading: Joi.string(),
        uri: Joi.string(),
      }),
    )
    .default(DEFAULT_OPTIONS.externalSearchSources),
});

export function validateOptions({
  validate,
  options,
}: OptionValidationContext<Options, PluginOptions>): PluginOptions {
  return validate(OptionsSchema, options);
}
