import { Product, ProductsResponse } from '@/types';

const API_BASE = '/api';

async function fetchApi<T>(path: string): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('Client API service called on the server. Use @/server/catalog instead.');
  }

  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error('Failed to fetch catalog data');
  return res.json();
}

export async function fetchAllProducts(): Promise<Product[]> {
  const data = await fetchApi<ProductsResponse>('/products?limit=100');
  return data.products;
}

export async function fetchProductsPaginated(
  limit: number,
  skip: number
): Promise<ProductsResponse> {
  return fetchApi<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
}

export async function fetchProduct(id: number): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`);
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const data = await fetchApi<ProductsResponse>(
    `/products?category=${encodeURIComponent(category)}`
  );
  return data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await fetchApi<ProductsResponse>(`/products?search=${encodeURIComponent(query)}`);
  return data.products;
}
