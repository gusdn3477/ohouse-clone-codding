const API_BASE = 'https://dummyjson.com';

export async function fetchCategories(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/products/category-list`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}
