export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

const API_BASE = 'https://fakestoreapi.com';

export async function getAllProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function getProduct(id: number): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}

export async function getCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/products/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error('Failed to fetch products by category');
    return res.json();
}
