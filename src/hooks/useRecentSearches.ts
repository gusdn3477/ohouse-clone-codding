import { useState, useCallback } from 'react';

const STORAGE_KEY = 'todayshop_recent_searches';
const MAX_ITEMS = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }

    return [];
  });

  // 검색어 추가
  const addSearch = useCallback((term: string) => {
    if (!term.trim()) return;

    setRecentSearches((prev) => {
      const newSearches = [term, ...prev.filter((t) => t !== term)].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  }, []);

  // 검색어 삭제
  const removeSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const newSearches = prev.filter((t) => t !== term);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSearches));
      return newSearches;
    });
  }, []);

  // 전체 삭제
  const clearSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearSearches,
  };
}
