import 'server-only';

import { count, eq, ilike, inArray, or, type SQL } from 'drizzle-orm';
import { db } from '@/db/client';
import { products } from '@/db/schema';
import { Product, ProductsResponse } from '@/types';

const DEFAULT_PRODUCT_LIMIT = 100;
const MAX_PRODUCT_LIMIT = 100;

type ProductListParams = {
  limit?: number;
  skip?: number;
};

function toPositiveInt(value: string | null, fallback: number) {
  if (!value) return fallback;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return fallback;

  return parsed;
}

export function parseProductListParams(searchParams: URLSearchParams): Required<ProductListParams> {
  const limit = Math.min(
    toPositiveInt(searchParams.get('limit'), DEFAULT_PRODUCT_LIMIT),
    MAX_PRODUCT_LIMIT
  );
  const skip = toPositiveInt(searchParams.get('skip'), 0);

  return { limit, skip };
}

type ProductRow = typeof products.$inferSelect;

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    price: row.price,
    description: row.description,
    category: row.category,
    thumbnail: row.thumbnail,
    images: row.images,
    rating: row.rating,
    stock: row.stock,
    brand: row.brand,
    discountPercentage: row.discountPercentage,
    reviews: row.reviews,
  };
}

async function countProducts(where?: SQL) {
  const query = db.select({ value: count() }).from(products);
  const rows = where ? await query.where(where) : await query;

  return Number(rows[0]?.value ?? 0);
}

export async function getAllProducts({
  limit = DEFAULT_PRODUCT_LIMIT,
  skip = 0,
}: ProductListParams = {}): Promise<ProductsResponse> {
  const [rows, total] = await Promise.all([
    db.select().from(products).orderBy(products.id).limit(limit).offset(skip),
    countProducts(),
  ]);

  return {
    products: rows.map(toProduct),
    total,
    skip,
    limit,
  };
}

export async function getProduct(productId: number): Promise<Product> {
  const [row] = await db.select().from(products).where(eq(products.id, productId)).limit(1);

  if (!row) {
    throw new Error(`Product not found: ${productId}`);
  }

  return toProduct(row);
}

export async function getProductsByIds(productIds: number[]): Promise<Product[]> {
  const uniqueIds = [...new Set(productIds)];

  if (uniqueIds.length === 0) {
    return [];
  }

  const rows = await db.select().from(products).where(inArray(products.id, uniqueIds));
  const productById = new Map(rows.map((row) => [row.id, toProduct(row)]));

  return uniqueIds.flatMap((id) => {
    const product = productById.get(id);
    return product ? [product] : [];
  });
}

export async function getProductsByCategory(category: string): Promise<ProductsResponse> {
  const where = eq(products.category, category);
  const [rows, total] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(products.id)
      .limit(DEFAULT_PRODUCT_LIMIT),
    countProducts(where),
  ]);

  return {
    products: rows.map(toProduct),
    total,
    skip: 0,
    limit: DEFAULT_PRODUCT_LIMIT,
  };
}

export async function searchCatalogProducts(query: string): Promise<ProductsResponse> {
  const searchPattern = `%${query}%`;
  const where = or(
    ilike(products.title, searchPattern),
    ilike(products.description, searchPattern),
    ilike(products.brand, searchPattern),
    ilike(products.category, searchPattern)
  );

  const [rows, total] = await Promise.all([
    db
      .select()
      .from(products)
      .where(where)
      .orderBy(products.id)
      .limit(DEFAULT_PRODUCT_LIMIT),
    countProducts(where),
  ]);

  return {
    products: rows.map(toProduct),
    total,
    skip: 0,
    limit: DEFAULT_PRODUCT_LIMIT,
  };
}

export async function getCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .orderBy(products.category);

  return rows.map((row) => row.category);
}

export async function getStaticProducts(): Promise<Product[]> {
  const data = await getAllProducts({ limit: DEFAULT_PRODUCT_LIMIT, skip: 0 });
  return data.products;
}
