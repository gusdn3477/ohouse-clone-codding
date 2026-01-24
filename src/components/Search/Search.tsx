import { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { SearchBar } from './SearchBar';

export interface SearchProps {
    /** Current value of the search input */
    query: string;
    /** Callback when input value changes */
    onQueryChange: (query: string) => void;
    /** Callback when search is submitted */
    onSearch: (query: string) => void;
    /** Content to display in the results/suggestions area. Can be a function receiving { close: () => void } */
    children?: ReactNode | ((props: { close: () => void }) => ReactNode);
    /** Placeholder text */
    placeholder?: string;
    /** className for the desktop container */
    className?: string;
}

export function Search({
    query,
    onQueryChange,
    onSearch,
    children,
    placeholder = '검색어를 입력하세요',
    className = ''
}: SearchProps) {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // callback is memoized to prevent unnecessary re-renders of children
    const close = useCallback(() => {
        setIsFocused(false);
    }, []);

    const renderChildren = () => {
        if (typeof children === 'function') {
            return children({ close });
        }
        return children;
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (val: string) => {
        onSearch(val);
        close();
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <SearchBar
                value={query}
                onChange={onQueryChange}
                onSearch={handleSearch}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                inputClassName="bg-white border border-border"
            />

            {isFocused && children && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-dropdown border border-border z-50 overflow-hidden">
                    {renderChildren()}
                </div>
            )}
        </div>
    );
}