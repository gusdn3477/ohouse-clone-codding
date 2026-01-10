import Link from 'next/link';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import SearchBar from './Search/SearchBar';
import SearchInput from './Search/SearchInput';
import SearchSuggestions from './Search/SearchSuggestions';
import Drawer from '@/components/Drawer';

export default function Header() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Sync query with URL
  useEffect(() => {
    if (router.query.search) {
      setSearchQuery(router.query.search as string);
    }
  }, [router.query.search]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Handle Search Submission
  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    addSearch(term);
    setIsSearchOpen(false); // Close drawer
    router.push(`/products?search=${encodeURIComponent(term.trim())}`);
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

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <SearchBar />
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
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold bg-accent text-white rounded-full">
                      {totalItems}
                    </span>
                  )}
                </a>
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Search Icon (Opens Drawer) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-text-secondary"
                aria-label="검색"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              <Link href="/cart" legacyBehavior>
                <a className="relative p-2 text-text-secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold bg-accent text-white rounded-full">
                      {totalItems}
                    </span>
                  )}
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

      {/* Mobile Search Drawer (Composition) */}
      <Drawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}>
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 -ml-2 text-text hover:bg-background-secondary rounded-full"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="flex-1">
              <SearchInput
                ref={mobileInputRef}
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="상품 검색..."
                inputClassName="border-none bg-background-secondary focus:ring-0"
                containerClassName="w-full"
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <SearchSuggestions
              recentSearches={recentSearches}
              onRemoveRecent={removeSearch}
              onClearRecent={clearSearches}
              onSelect={(keyword) => {
                setSearchQuery(keyword);
                handleSearch(keyword);
              }}
            />
          </div>
        </div>
      </Drawer>

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
