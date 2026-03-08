import { QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchFeaturedProducts,
  fetchProduct,
  fetchProductsByCategory,
  fetchProductsPaginated,
  searchProducts,
} from './services';
import { catalogQueryKeys } from './queryKeys';

export function useCategories() {
  return useQuery({
    queryKey: catalogQueryKeys.categories,
    queryFn: fetchCategories,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: catalogQueryKeys.featuredProducts(limit),
    queryFn: () => fetchFeaturedProducts(limit),
  });
}

export function useInfiniteProducts(pageSize = 12, enabled = true) {
  return useInfiniteQuery({
    queryKey: catalogQueryKeys.productsInfinite(pageSize),
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
    enabled,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: catalogQueryKeys.product(id),
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });
}

export function useProductsByCategory(category: string | null) {
  return useQuery({
    queryKey: category ? catalogQueryKeys.productsByCategory(category) : ['products', 'category', 'idle'],
    queryFn: () => fetchProductsByCategory(category as string),
    enabled: Boolean(category),
  });
}

export function useSearchProducts(query: string | null) {
  return useQuery({
    queryKey: query ? catalogQueryKeys.search(query) : ['products', 'search', 'idle'],
    queryFn: () => searchProducts(query as string),
    enabled: Boolean(query && query.length > 0),
  });
}

export async function prefetchCategories(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: catalogQueryKeys.categories,
    queryFn: fetchCategories,
  });
}

export async function prefetchHomeCatalogPreview(queryClient: QueryClient, featuredLimit = 8) {
  await Promise.all([
    prefetchCategories(queryClient),
    queryClient.prefetchQuery({
      queryKey: catalogQueryKeys.featuredProducts(featuredLimit),
      queryFn: () => fetchFeaturedProducts(featuredLimit),
    }),
  ]);
}

export async function prefetchInfiniteProducts(queryClient: QueryClient, pageSize = 12) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: catalogQueryKeys.productsInfinite(pageSize),
    queryFn: async ({ pageParam = 0 }) => {
      const data = await fetchProductsPaginated(pageSize, pageParam * pageSize);
      return {
        items: data.products,
        nextPage: (pageParam + 1) * pageSize < data.total ? pageParam + 1 : undefined,
        totalCount: data.total,
      };
    },
    initialPageParam: 0,
  });
}

export async function prefetchCatalogList(
  queryClient: QueryClient,
  {
    currentCategory,
    pageSize = 12,
    searchQuery,
  }: {
    currentCategory: string | null;
    pageSize?: number;
    searchQuery: string | null;
  }
) {
  const tasks: Promise<unknown>[] = [prefetchCategories(queryClient)];

  if (searchQuery) {
    tasks.push(
      queryClient.prefetchQuery({
        queryKey: catalogQueryKeys.search(searchQuery),
        queryFn: () => searchProducts(searchQuery),
      })
    );
  } else if (currentCategory) {
    tasks.push(
      queryClient.prefetchQuery({
        queryKey: catalogQueryKeys.productsByCategory(currentCategory),
        queryFn: () => fetchProductsByCategory(currentCategory),
      })
    );
  } else {
    tasks.push(prefetchInfiniteProducts(queryClient, pageSize));
  }

  await Promise.all(tasks);
}

export async function prefetchProduct(queryClient: QueryClient, id: number) {
  await queryClient.prefetchQuery({
    queryKey: catalogQueryKeys.product(id),
    queryFn: () => fetchProduct(id),
  });
}

export async function prefetchProductsByCategory(queryClient: QueryClient, category: string) {
  await queryClient.prefetchQuery({
    queryKey: catalogQueryKeys.productsByCategory(category),
    queryFn: () => fetchProductsByCategory(category),
  });
}

export async function prefetchCatalogDetail(queryClient: QueryClient, id: number) {
  await prefetchProduct(queryClient, id);
  const product = queryClient.getQueryData<{ category: string }>(catalogQueryKeys.product(id));

  if (product?.category) {
    await prefetchProductsByCategory(queryClient, product.category);
  }
}
