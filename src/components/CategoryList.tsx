import { useRef, useState } from 'react';
import CategoryButton from './CategoryButton';
import { formatCategoryName } from '@/utils';

interface CategoryListProps {
    categories: string[];
    currentCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    className?: string;
}

// Mobile View: Horizontal Scroll
export function CategoryMobile({
    categories,
    currentCategory,
    onSelectCategory,
    className = '',
}: CategoryListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const onMouseLeave = () => {
        setIsDragging(false);
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const scrollByAmount = (amount: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    return (
        <div className={`relative mb-6 group ${className}`}>
            {/* Scroll Arrows */}
            <button
                onClick={() => scrollByAmount(-200)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-background-secondary transition-colors opacity-0 group-hover:opacity-100 duration-200"
                aria-label="이전 카테고리"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <div
                ref={scrollRef}
                className={`overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1 pb-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            >
                <div className="flex gap-2 min-w-max">
                    <CategoryButton isActive={!currentCategory} onClick={() => onSelectCategory(null)}>
                        전체
                    </CategoryButton>
                    {categories.map((category) => (
                        <CategoryButton
                            key={category}
                            isActive={currentCategory === category}
                            onClick={() => onSelectCategory(category)}
                        >
                            {formatCategoryName(category)}
                        </CategoryButton>
                    ))}
                </div>
            </div>

            <button
                onClick={() => scrollByAmount(200)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white shadow-md rounded-full hover:bg-background-secondary transition-colors opacity-0 group-hover:opacity-100 duration-200"
                aria-label="다음 카테고리"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    );
}

// Desktop View: Grid/Wrap
export function CategoryDesktop({
    categories,
    currentCategory,
    onSelectCategory,
    className = '',
}: CategoryListProps) {
    return (
        <div className={`mb-8 ${className}`}>
            <div className="flex flex-wrap gap-3 p-1">
                <CategoryButton
                    isActive={!currentCategory}
                    onClick={() => onSelectCategory(null)}
                >
                    전체
                </CategoryButton>
                {categories.map((category) => (
                    <CategoryButton
                        key={category}
                        isActive={currentCategory === category}
                        onClick={() => onSelectCategory(category)}
                    >
                        {formatCategoryName(category)}
                    </CategoryButton>
                ))}
            </div>
        </div>
    );
}
