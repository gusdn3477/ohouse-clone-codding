export const queryKeys = {
    products: ['products'] as const,
    productsInfinite: ['products', 'infinite'] as const,
    product: (id: number) => ['product', id] as const,
    categories: ['categories'] as const,
    productsByCategory: (category: string) => ['products', 'category', category] as const,
    search: (query: string) => ['products', 'search', query] as const,
};
