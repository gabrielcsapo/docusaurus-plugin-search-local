/* eslint-disable @typescript-eslint/no-explicit-any */
declare let _paq: Array<[string, string, boolean, number]>;
declare let gtag: GTag;
declare let appInsights: any;

type GTag = (
  command: 'config' | 'event',
  targetId: string,
  config?: {
    [key: string]: any;
    groups?: string | string[];
    send_to?: string | string[];
    event_callback?: () => void;
  },
) => void;

import { SearchAnalyticsFn } from '../../types';

function NoSearchAnalytics() {
  // No search analytics implemnetation found.
}

let cached: SearchAnalyticsFn | undefined;

export function _resetCache() {
  cached = undefined;
}

export function SearchAnalyticsFactory(): SearchAnalyticsFn {
  if (!cached) {
    if (typeof _paq !== 'undefined' && _paq && _paq?.push) {
      cached = function searchAnalytics(query, results) {
        _paq.push([
          'trackSiteSearch',
          query, // Search keyword searched for
          false, // Search category selected in your search engine. If you do not need this, set to false
          (results || []).length, // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
        ]);
      };
    }

    if (typeof gtag !== 'undefined' && typeof gtag === 'function') {
      cached = function searchAnalytics(query) {
        gtag('event', 'search', {
          search_term: query,
        });
      };
    }

    if (typeof appInsights !== 'undefined') {
      cached = function searchAnalytics(query) {
        appInsights.trackEvent({
          name: 'search',
          properties: {
            search_term: query,
          },
        });
      };
    }
  }

  return cached || NoSearchAnalytics;
}
