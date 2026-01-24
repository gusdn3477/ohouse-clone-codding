import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/types';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export function useProductSort(products: Product[]) {
    const [sortBy, setSortBy] = useState<SortOption>('default');

    const sortedProducts = useMemo(() => {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    }, [products, sortBy]);

    const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortOption);
    }, []);

    return {
        sortBy,
        setSortBy,
        sortedProducts,
        handleSortChange
    };
}
