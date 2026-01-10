import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
    className?: string; // 컨테이너 스타일
    onSearch?: () => void;
    autoFocus?: boolean;
}

export default function SearchBar({ className = '', onSearch, autoFocus = false }: SearchBarProps) {
    const router = useRouter();
    const { recentSearches, addSearch, removeSearch, clearSearches } = useRecentSearches();

    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (router.query.search) {
            setQuery(router.query.search as string);
        }
    }, [router.query.search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleSearch = (e?: FormEvent, keyword?: string) => {
        e?.preventDefault();
        const searchTerm = keyword || query;
        if (!searchTerm.trim()) return;

        addSearch(searchTerm);
        // 검색어 입력 시 드롭다운 닫고 포커스 해제
        setIsFocused(false);
        inputRef.current?.blur();

        router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        onSearch?.();
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <form onSubmit={(e) => handleSearch(e)} className="relative w-full">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="상품 검색..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="input pr-12 w-full"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </button>
            </form>

            {/* Desktop Dropdown */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown border border-border z-50 overflow-hidden">
                    <SearchSuggestions
                        recentSearches={recentSearches}
                        onRemoveRecent={removeSearch}
                        onClearRecent={clearSearches}
                        onSelect={(keyword) => {
                            setQuery(keyword);
                            handleSearch(undefined, keyword);
                        }}
                        // onMouseDown으로 blur 방지
                        onMouseDown={(e) => e.preventDefault()}
                    />
                </div>
            )}
        </div>
    );
}
