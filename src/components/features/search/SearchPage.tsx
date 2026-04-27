'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/features/search/Search/SearchBar';
import { SearchItem } from '@/components/features/search/Search/SearchItem';
import { useRecentSearches } from '@/hooks/useRecentSearches';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    addSearch(trimmed);
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelect = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-white p-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="-ml-1 rounded-full p-2 text-text hover:bg-background-secondary"
          aria-label="뒤로 가기"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-text">최근 검색어</h2>
          {recentSearches.length > 0 && (
            <button
              type="button"
              onClick={clearSearches}
              className="text-xs text-text-secondary underline hover:text-text"
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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSearch(term);
                }}
                className="cursor-pointer p-2 hover:text-red-500"
                aria-label={`${term} 검색어 삭제`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            }
          >
            {term}
          </SearchItem>
        ))}

        {recentSearches.length === 0 && (
          <div className="py-10 text-center text-sm text-text-secondary">
            최근 검색 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
