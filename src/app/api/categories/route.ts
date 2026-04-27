import { NextResponse } from 'next/server';
import { getCategories } from '@/server/catalog';

export const revalidate = 3600;

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 502 });
  }
}
