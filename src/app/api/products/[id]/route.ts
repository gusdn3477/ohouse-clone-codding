import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/server/catalog';

export const revalidate = 3600;

interface ProductRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: ProductRouteContext) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ message: 'Invalid product id' }, { status: 400 });
  }

  try {
    const product = await getProduct(productId);
    return NextResponse.json(product);
  } catch (error) {
    console.error(`Failed to fetch product ${productId}:`, error);
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
}
