import { Product, ProductsResponse } from '@/types';

const API_BASE = 'https://dummyjson.com';

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
