import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { Search, SearchItem } from '@/components/Search';
import Badge from '@/components/Badge';

const Drawer = dynamic(() => import('@/components/Drawer'), { ssr: false });

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Sync query with URL
  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
  }, [router.query.search]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" legacyBehavior>
              <a className="flex items-center gap-2">
                <span className="text-2xl">🏠</span>
                <span className="text-xl font-bold text-primary">오늘의샵</span>
              </a>
            </Link>

            {/* Search - Desktop & Mobile Trigger */}
            <div className="flex-1 max-w-xl mx-8 flex justify-end md:justify-center">
              <div className="w-full hidden md:block">
                {/* Desktop Search */}
                <Search
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  onSearch={handleSearch}
                >
                  {({ close }) => (
                    <div>
                      {recentSearches.length > 0 && (
                        <>
                          <div className="flex items-center justify-between px-4 py-2 bg-background-secondary">
                            <span className="text-xs font-bold text-text-secondary">최근 검색어</span>
                            <button onClick={clearSearches} className="text-xs text-text-secondary hover:text-text underline">전체 삭제</button>
                          </div>
                          {recentSearches.map(term => (
                            <SearchItem
                              key={term}
                              onClick={() => { handleSelect(term); close(); }}
                              rightContent={
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeSearch(term); }}
                                  className="hover:text-red-500 p-1"
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
                        <div className="p-4 text-sm text-text-secondary text-center">
                          최근 검색 내역이 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </Search>
              </div>

              <div className="md:hidden">
                {/* Mobile Search Trigger & Drawer Content */}
                <Search
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  onSearch={handleSearch}
                  mobileTrigger={
                    <button className="p-2 text-text-secondary">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                    </button>
                  }
                >
                  {({ close }) => (
                    <div>
                      <div className="p-4 pb-2 text-sm font-bold text-text">최근 검색어</div>
                      {recentSearches.map(term => (
                        <SearchItem
                          key={term}
                          onClick={() => { handleSelect(term); close(); }}
                          rightContent={
                            <button
                              onClick={(e) => { e.stopPropagation(); removeSearch(term); }}
                              className="hover:text-red-500 p-1"
                            >
                              ×
                            </button>
                          }
                        >
                          {term}
                        </SearchItem>
                      ))}
                      {recentSearches.length > 0 && (
                        <div className="px-4 py-2 text-right">
                          <button onClick={clearSearches} className="text-xs text-text-secondary hover:text-text underline">전체 삭제</button>
                        </div>
                      )}
                    </div>
                  )}
                </Search>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/products" legacyBehavior>
                <a className="text-text-secondary hover:text-primary font-medium transition-colors">
                  스토어
                </a>
              </Link>
              <Link href="/cart" legacyBehavior>
                <a className="relative p-2 text-text-secondary hover:text-primary transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <Badge count={totalItems} variant="accent" position="absolute" />
                </a>
              </Link>
            </nav>

            {/* Mobile Actions (Cart + Menu) */}
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/cart" legacyBehavior>
                <a className="relative p-2 text-text-secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  <Badge count={totalItems} variant="accent" position="absolute" />
                </a>
              </Link>

              <button onClick={toggleMobileMenu} className="p-2 text-text-secondary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        position="full"
      >
        <div className="flex flex-col h-full bg-white w-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold">메뉴</h2>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-text-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="p-4 space-y-4">
            <Link href="/" legacyBehavior>
              <a
                className="block text-lg font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                홈
              </a>
            </Link>
            <Link href="/products" legacyBehavior>
              <a
                className="block text-lg font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                스토어
              </a>
            </Link>
            <Link href="/cart" legacyBehavior>
              <a
                className="block text-lg font-medium text-text hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                장바구니 {totalItems > 0 && <span className="text-primary font-bold">({totalItems})</span>}
              </a>
            </Link>
          </nav>
        </div>
      </Drawer>
    </>
  );
}