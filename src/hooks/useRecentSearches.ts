import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'todayshop_recent_searches';
const MAX_ITEMS = 10;

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // 초기 로드
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load recent searches:', error);
        }
    }, []);

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
