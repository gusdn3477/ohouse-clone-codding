import { useQuery, useInfiniteQuery, QueryClient } from '@tanstack/react-query';
import type { Product, ProductsResponse } from '@/types';

// Re-export types
export type { Product, ProductsResponse } from '@/types';

// DummyJSON API Base
const API_BASE = 'https://dummyjson.com';

// ========== Fetch Functions ==========

export async function fetchAllProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products?limit=100`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data: ProductsResponse = await res.json();
    return data.products;
}

export async function fetchProductsPaginated(
    limit: number,
    skip: number
): Promise<ProductsResponse> {
    const res = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function fetchCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/products/category-list`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error('Failed to fetch products by category');
    const data: ProductsResponse = await res.json();
    return data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to search products');
    const data: ProductsResponse = await res.json();
    return data.products;
}

// ========== Query Keys ==========

export const queryKeys = {
    products: ['products'] as const,
    productsInfinite: ['products', 'infinite'] as const,
    product: (id: number) => ['product', id] as const,
    categories: ['categories'] as const,
    productsByCategory: (category: string) => ['products', 'category', category] as const,
    search: (query: string) => ['products', 'search', query] as const,
};

// ========== Custom Hooks ==========

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

export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories,
        queryFn: fetchCategories,
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

// ========== Prefetch Helpers (SSR) ==========

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

export async function prefetchCategories(queryClient: QueryClient) {
    await queryClient.prefetchQuery({
        queryKey: queryKeys.categories,
        queryFn: fetchCategories,
    });
}

export async function prefetchProductsByCategory(queryClient: QueryClient, category: string) {
    await queryClient.prefetchQuery({
        queryKey: queryKeys.productsByCategory(category),
        queryFn: () => fetchProductsByCategory(category),
    });
}
