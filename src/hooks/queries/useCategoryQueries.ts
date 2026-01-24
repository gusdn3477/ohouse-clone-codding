import { useQuery, QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import { fetchCategories } from '@/services/api/categories';

export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories,
        queryFn: fetchCategories,
    });
}

// Prefetch Helpers (SSR)
export async function prefetchCategories(queryClient: QueryClient) {
    await queryClient.prefetchQuery({
        queryKey: queryKeys.categories,
        queryFn: fetchCategories,
    });
}
