import { vi, beforeEach, describe, test, expect } from 'vitest';
import { SearchResult } from '../../types';
import { SearchAnalyticsFactory, _resetCache } from './SearchAnalyticsFactory';

const query = 'some query';
const results = [] as SearchResult[];

describe('SearchAnalyticsFactory', () => {
  beforeEach(() => {
    _resetCache();
  });

  test.each([
    [
      () => {
        const trackFn = vi.fn();
        const _paq = {
          push: trackFn,
        };

        vi.stubGlobal('_paq', _paq);

        return trackFn;
      },
      ['trackSiteSearch', query, false, 0],
    ],
    [
      () => {
        const gtag = vi.fn();

        vi.stubGlobal('gtag', gtag);

        return gtag;
      },
      'event',
      'search',
      {
        search_term: query,
      },
    ],
    [
      () => {
        const trackFn = vi.fn();
        const appInsights = {
          trackEvent: trackFn,
        };

        vi.stubGlobal('appInsights', appInsights);

        return trackFn;
      },
      {
        name: 'search',
        properties: {
          search_term: query,
        },
      },
    ],
  ])(
    'SearchAnalyticsFactory() should be called with',
    (setupGlobal, ...expected) => {
      const trackFn = setupGlobal();

      const searchAnalytics = SearchAnalyticsFactory();

      searchAnalytics(query, results);

      expect(trackFn).toBeCalledWith(...expected);
    },
  );
});
