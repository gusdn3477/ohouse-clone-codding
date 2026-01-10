import Link from 'next/link';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '@/context/CartContext';
import SearchBar from './Search/SearchBar';

// SearchOverlay는 클라이언트 사이드에서만 렌더링 (Portal 사용)
const SearchOverlay = dynamic(() => import('./Search/SearchOverlay'), { ssr: false });

export default function Header() {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

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
              {/* Search Icon (Opens Overlay) */}
              <button
                onClick={() => setIsSearchOverlayOpen(true)}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <nav className="px-4 py-4 space-y-2">
              <Link href="/products" legacyBehavior>
                <a
                  className="block px-4 py-3 text-text hover:bg-background-secondary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  스토어
                </a>
              </Link>
              <Link href="/cart" legacyBehavior>
                <a
                  className="block px-4 py-3 text-text hover:bg-background-secondary rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  장바구니 {totalItems > 0 && `(${totalItems})`}
                </a>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
      />
    </>
  );
}
