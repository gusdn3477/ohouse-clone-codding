import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { SearchBar } from '@/components/features/search/Search/SearchBar';
import { SearchItem } from '@/components/features/search/Search/SearchItem';
import {
  clearRecentSearches,
  removeRecentSearch,
  submitSearch,
  useRecentSearchesState,
} from './store';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { items: recentSearches } = useRecentSearchesState();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (term: string) => {
    const normalized = term.trim();
    if (!normalized) {
      return;
    }

    submitSearch(normalized);
    router.push(`/products?search=${encodeURIComponent(normalized)}`);
  };

  const handleSelect = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-2 p-3 border-b border-border sticky top-0 bg-white z-10">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-1 text-text hover:bg-background-secondary rounded-full"
          aria-label="뒤로 가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1">
          <SearchBar
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            placeholder="검색어를 입력하세요"
            containerClassName="w-full"
            inputClassName="bg-background-secondary focus:ring-0"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-text">최근 검색어</h2>
          {recentSearches.length > 0 && (
            <button
              onClick={clearRecentSearches}
              className="text-xs text-text-secondary hover:text-text underline"
            >
              전체 삭제
            </button>
          )}
        </div>

        {recentSearches.map((term) => (
          <SearchItem
            key={term}
            onClick={() => handleSelect(term)}
            rightContent={
              <div
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  removeRecentSearch(term);
                }}
                className="p-2 hover:text-red-500 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            }
          >
            {term}
          </SearchItem>
        ))}

        {recentSearches.length === 0 && (
          <div className="py-10 text-center text-text-secondary text-sm">
            최근 검색 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
