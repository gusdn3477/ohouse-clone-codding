import type { Product, ProductsResponse } from '@/types';

const API_BASE = 'https://dummyjson.com';

export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products?limit=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const data = await fetchProductsPaginated(limit, 0);
  return data.products;
}

export async function fetchProductsPaginated(limit: number, skip: number): Promise<ProductsResponse> {
  const response = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products by category');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search products');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

export async function fetchCategories(): Promise<string[]> {
  const response = await fetch(`${API_BASE}/products/category-list`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

export async function getCatalogDetailStaticPaths(limit = 20) {
  const products = await fetchAllProducts();
  return products.slice(0, limit).map((product) => ({
    params: { id: product.id.toString() },
  }));
}
