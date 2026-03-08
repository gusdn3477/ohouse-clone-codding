import {
  clearRecentSearches,
  removeRecentSearch,
  submitSearch,
  useRecentSearchesState,
} from '@/microfrontends/search/public';

export function useRecentSearches() {
  const { items } = useRecentSearchesState();

  return {
    recentSearches: items,
    addSearch: submitSearch,
    removeSearch: removeRecentSearch,
    clearSearches: clearRecentSearches,
  };
}
