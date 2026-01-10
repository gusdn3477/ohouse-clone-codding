import { useEffect, useState, useRef, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import SearchSuggestions from './SearchSuggestions';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with URL
    useEffect(() => {
        if (router.query.search) {
            setQuery(router.query.search as string);
        }
    }, [router.query.search]);

    // Body lock
    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Open 시 input focus
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSearch = (e?: FormEvent, keyword?: string) => {
        e?.preventDefault();
        const searchTerm = keyword || query;
        if (!searchTerm.trim()) return;

        addSearch(searchTerm);
        router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        onClose();
    };

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b border-border">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 text-text hover:bg-background-secondary rounded-full"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <form onSubmit={(e) => handleSearch(e)} className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="상품 검색..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="input pr-12 w-full border-none bg-background-secondary focus:ring-0"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Body: Suggestions (Full Width/Height) */}
            <div className="flex-1 overflow-y-auto bg-white">
                <SearchSuggestions
                    recentSearches={recentSearches}
                    onRemoveRecent={removeSearch}
                    onClearRecent={clearSearches}
                    onSelect={(keyword) => {
                        setQuery(keyword);
                        handleSearch(undefined, keyword);
                    }}
                />
            </div>
        </div>,
        document.body
    );
}
