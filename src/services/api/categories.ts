export async function fetchCategories(): Promise<string[]> {
  if (typeof window === 'undefined') {
    throw new Error('Client API service called on the server. Use @/server/catalog instead.');
  }

  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
