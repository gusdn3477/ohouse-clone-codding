import { NextRequest, NextResponse } from 'next/server';
import {
  getAllProducts,
  getProductsByCategory,
  parseProductListParams,
  searchCatalogProducts,
} from '@/server/catalog';

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category')?.trim();
  const query = searchParams.get('search')?.trim() || searchParams.get('q')?.trim();

  try {
    if (query) {
      const products = await searchCatalogProducts(query);
      return NextResponse.json(products);
    }

    if (category) {
      const products = await getProductsByCategory(category);
      return NextResponse.json(products);
    }

    const pagination = parseProductListParams(searchParams);
    const products = await getAllProducts(pagination);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 502 });
  }
}
