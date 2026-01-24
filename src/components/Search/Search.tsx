import { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { useViewport } from '@/hooks/useViewport';
import Drawer from '@/components/Drawer';
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
    /** Element to trigger mobile search (e.g. search icon) */
    mobileTrigger?: ReactNode;
    /** Placeholder text */
    placeholder?: string;
    /** className for the desktop container */
    className?: string;
    /** Force display mode */
    mode?: 'auto' | 'desktop' | 'mobile';
}

export function Search({
    query,
    onQueryChange,
    onSearch,
    children,
    mobileTrigger,
    placeholder = '검색어를 입력하세요',
    className = '',
    mode = 'auto'
}: SearchProps) {
    const { isMobile: viewportIsMobile } = useViewport();
    const [isOpen, setIsOpen] = useState(false); // Mobile Drawer state
    const [isFocused, setIsFocused] = useState(false); // Desktop focus state
    const desktopContainerRef = useRef<HTMLDivElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    // callback is memoized to prevent unnecessary re-renders of children
    const close = useCallback(() => {
        setIsOpen(false);
        setIsFocused(false);
        mobileInputRef.current?.blur();
    }, []);

    // memoized specifically for Drawer onClose to prevent useEffect cleanup abuse
    const handleDrawerClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const renderChildren = () => {
        if (typeof children === 'function') {
            return children({ close });
        }
        return children;
    };

    // Desktop: Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (desktopContainerRef.current && !desktopContainerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        // Check viewport only if mode is auto or desktop
        const shouldAddListener = mode === 'desktop' || (mode === 'auto' && !viewportIsMobile);

        if (shouldAddListener) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [viewportIsMobile, mode]);

    // Mobile: Focus input when drawer opens
    useEffect(() => {
        const isMobileMode = mode === 'mobile' || (mode === 'auto' && viewportIsMobile);
        if (isMobileMode && isOpen) {
            const timer = setTimeout(() => {
                mobileInputRef.current?.focus();
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [viewportIsMobile, isOpen, mode]);

    const handleSearch = (val: string) => {
        onSearch(val);
        close();
    };

    const isMobileMode = mode === 'mobile' || (mode === 'auto' && viewportIsMobile);

    if (isMobileMode) {
        return (
            <>
                <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                    {mobileTrigger || (
                        <button className="p-2" aria-label="검색 열기">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                            </svg>
                        </button>
                    )}
                </div>

                <Drawer isOpen={isOpen} onClose={handleDrawerClose} position="full">
                    <div className="flex flex-col h-full bg-white">
                        <div className="flex items-center gap-2 p-4 border-b border-border">
                            <button
                                onClick={handleDrawerClose}
                                className="p-2 -ml-2 text-text hover:bg-background-secondary rounded-full"
                                aria-label="검색 닫기"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <div className="flex-1">
                                <SearchBar
                                    ref={mobileInputRef}
                                    value={query}
                                    onChange={onQueryChange}
                                    onSearch={handleSearch}
                                    placeholder={placeholder}
                                    containerClassName="w-full"
                                    inputClassName="bg-background-secondary focus:ring-0"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {renderChildren()}
                        </div>
                    </div>
                </Drawer>
            </>
        );
    }

    // Desktop mode
    return (
        <div ref={desktopContainerRef} className={`relative ${className}`}>
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