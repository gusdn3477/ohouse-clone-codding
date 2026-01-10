import React from 'react';

const RECOMMENDED_KEYWORDS = [
    '조명', '의자', '소파', '침대', '수납장', '러그', '커튼', '데스크'
];

interface SearchSuggestionsProps {
    recentSearches: string[];
    onRemoveRecent: (term: string) => void;
    onClearRecent: () => void;
    onSelect: (keyword: string) => void;
    onMouseDown?: (e: React.MouseEvent) => void; // 포커스 유지용
}

export default function SearchSuggestions({
    recentSearches,
    onRemoveRecent,
    onClearRecent,
    onSelect,
    onMouseDown,
}: SearchSuggestionsProps) {
    return (
        <div className="p-4" onMouseDown={onMouseDown}>
            {/* 최근 검색어 */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-text">최근 검색어</h4>
                    {recentSearches.length > 0 && (
                        <button
                            onClick={onClearRecent}
                            className="text-xs text-text-secondary hover:text-text underline"
                        >
                            전체 삭제
                        </button>
                    )}
                </div>
                {recentSearches.length === 0 ? (
                    <p className="text-sm text-text-secondary py-2">최근 검색 내역이 없습니다.</p>
                ) : (
                    <ul className="space-y-1">
                        {recentSearches.map((term) => (
                            <li key={term} className="flex items-center justify-between group">
                                <button
                                    className="flex-1 text-left text-sm text-text hover:text-primary py-1.5 truncate"
                                    onClick={() => onSelect(term)}
                                >
                                    {term}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveRecent(term);
                                    }}
                                    className="p-1 text-text-secondary hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                    aria-label="삭제"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 추천 검색어 */}
            <div>
                <h4 className="text-sm font-bold text-text mb-2">추천 검색어</h4>
                <div className="flex flex-wrap gap-2">
                    {RECOMMENDED_KEYWORDS.map((keyword) => (
                        <button
                            key={keyword}
                            className="px-3 py-1.5 bg-background-secondary text-sm text-text rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                            onClick={() => onSelect(keyword)}
                        >
                            {keyword}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
