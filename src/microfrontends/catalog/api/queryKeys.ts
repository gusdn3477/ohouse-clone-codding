export const catalogQueryKeys = {
  categories: ['categories'] as const,
  featuredProducts: (limit: number) => ['products', 'featured', limit] as const,
  product: (id: number) => ['product', id] as const,
  productsByCategory: (category: string) => ['products', 'category', category] as const,
  productsInfinite: (pageSize: number) => ['products', 'infinite', pageSize] as const,
  search: (query: string) => ['products', 'search', query] as const,
};
