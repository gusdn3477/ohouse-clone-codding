'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { Search, SearchItem } from '@/components/features/search/Search';
import Badge from '@/components/common/Badge';
import Drawer from '@/components/common/Drawer';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Handle Search Submission
  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    addSearch(term);
    router.push(`/products?search=${encodeURIComponent(term.trim())}`);
  };

  const handleSelect = (keyword: string) => {
    setSearchQuery(keyword);
    handleSearch(keyword);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏠</span>
              <span className="text-xl font-bold text-primary">오늘의샵</span>
            </Link>

            {/* Search - Desktop & Mobile Trigger */}
            <div className="mx-2 flex max-w-xl flex-1 justify-end md:mx-8 md:justify-center">
              <div className="hidden w-full md:block">
                {/* Desktop Search */}
                <Search query={searchQuery} onQueryChange={setSearchQuery} onSearch={handleSearch}>
                  {({ close }) => (
                    <div>
                      {recentSearches.length > 0 && (
                        <>
                          <div className="flex items-center justify-between bg-background-secondary px-4 py-2">
                            <span className="text-xs font-bold text-text-secondary">
                              최근 검색어
                            </span>
                            <button
                              onClick={clearSearches}
                              className="text-xs text-text-secondary underline hover:text-text"
                            >
                              전체 삭제
                            </button>
                          </div>
                          {recentSearches.map((term) => (
                            <SearchItem
                              key={term}
                              onClick={() => {
                                handleSelect(term);
                                close();
                              }}
                              rightContent={
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeSearch(term);
                                  }}
                                  className="p-1 hover:text-red-500"
                                >
                                  ×
                                </button>
                              }
                            >
                              {term}
                            </SearchItem>
                          ))}
                        </>
                      )}
                      {recentSearches.length === 0 && (
                        <div className="p-4 text-center text-sm text-text-secondary">
                          최근 검색 내역이 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </Search>
              </div>

              <div className="md:hidden">
                {/* Mobile Search Trigger -> Navigate to /search Page */}
                <Link
                  href="/search"
                  className="block p-2 text-text-secondary"
                  aria-label="검색 페이지로 이동"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/products"
                className="font-medium text-text-secondary transition-colors hover:text-primary"
              >
                스토어
              </Link>
              <Link
                href="/cart"
                className="relative p-2 text-text-secondary transition-colors hover:text-primary"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <Badge count={totalItems} variant="accent" position="absolute" />
              </Link>
            </nav>

            {/* Mobile Actions (Cart + Menu) */}
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/cart" className="relative p-2 text-text-secondary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <Badge count={totalItems} variant="accent" position="absolute" />
              </Link>

              <button onClick={toggleMobileMenu} className="p-2 text-text-secondary">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  {isMobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Mobile Menu Drawer (Right) */}
      <Drawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
        <Drawer.Content position="full">
          <div className="flex h-full w-full flex-col bg-white">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="text-lg font-bold">메뉴</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="-ml-2 p-2 text-text-secondary"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="space-y-4 p-4">
              <Link
                href="/"
                className="block text-lg font-medium text-text transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                href="/products"
                className="block text-lg font-medium text-text transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                스토어
              </Link>
              <Link
                href="/cart"
                className="block text-lg font-medium text-text transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                장바구니{' '}
                {totalItems > 0 && <span className="font-bold text-primary">({totalItems})</span>}
              </Link>
            </nav>
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  );
}
