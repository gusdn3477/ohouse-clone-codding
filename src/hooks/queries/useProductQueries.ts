import { useQuery, useInfiniteQuery, QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import {
    fetchAllProducts,
    fetchProduct,
    fetchProductsByCategory,
    fetchProductsPaginated,
    searchProducts
} from '@/services/api/products';

// Query Hooks
export function useProducts() {
    return useQuery({
        queryKey: queryKeys.products,
        queryFn: fetchAllProducts,
    });
}

export function useInfiniteProducts(pageSize = 12) {
    return useInfiniteQuery({
        queryKey: queryKeys.productsInfinite,
        queryFn: async ({ pageParam = 0 }) => {
            const data = await fetchProductsPaginated(pageSize, pageParam * pageSize);
            return {
                items: data.products,
                nextPage: (pageParam + 1) * pageSize < data.total ? pageParam + 1 : undefined,
                totalCount: data.total,
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 0,
    });
}

export function useProduct(id: number) {
    return useQuery({
        queryKey: queryKeys.product(id),
        queryFn: () => fetchProduct(id),
        enabled: !!id,
    });
}

export function useProductsByCategory(category: string | null) {
    return useQuery({
        queryKey: category ? queryKeys.productsByCategory(category) : queryKeys.products,
        queryFn: () => (category ? fetchProductsByCategory(category) : fetchAllProducts()),
    });
}

export function useSearchProducts(query: string) {
    return useQuery({
        queryKey: queryKeys.search(query),
        queryFn: () => searchProducts(query),
        enabled: query.length > 0,
    });
}

// Prefetch Helpers (SSR)
export async function prefetchProducts(queryClient: QueryClient) {
    await queryClient.prefetchQuery({
        queryKey: queryKeys.products,
        queryFn: fetchAllProducts,
    });
}

export async function prefetchInfiniteProducts(queryClient: QueryClient, pageSize = 12) {
    await queryClient.prefetchInfiniteQuery({
        queryKey: queryKeys.productsInfinite,
        queryFn: async () => {
            const data = await fetchProductsPaginated(pageSize, 0);
            return {
                items: data.products,
                nextPage: pageSize < data.total ? 1 : undefined,
                totalCount: data.total,
            };
        },
        initialPageParam: 0,
    });
}

export async function prefetchProduct(queryClient: QueryClient, id: number) {
    await queryClient.prefetchQuery({
        queryKey: queryKeys.product(id),
        queryFn: () => fetchProduct(id),
    });
}

export async function prefetchProductsByCategory(queryClient: QueryClient, category: string) {
    await queryClient.prefetchQuery({
        queryKey: queryKeys.productsByCategory(category),
        queryFn: () => fetchProductsByCategory(category),
    });
}
