import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from '../src/db/schema';
import type { Product, ProductsResponse } from '../src/types';

config({ path: '.env.local' });

const databaseUrl =
  process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/todayshop';

function toProductValues(product: Product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    thumbnail: product.thumbnail,
    images: product.images,
    rating: product.rating,
    stock: product.stock,
    brand: product.brand ?? 'Unknown',
    discountPercentage: product.discountPercentage ?? 0,
    reviews: product.reviews ?? [],
    updatedAt: new Date(),
  };
}

async function main() {
  const response = await fetch('https://dummyjson.com/products?limit=100');

  if (!response.ok) {
    throw new Error(`Failed to fetch seed products: ${response.status}`);
  }

  const data = (await response.json()) as ProductsResponse;
  const client = postgres(databaseUrl, { max: 1, prepare: false });
  const db = drizzle(client);

  for (const product of data.products) {
    const values = toProductValues(product);

    await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({
        target: products.id,
        set: values,
      });
  }

  await client.end();

  console.log(`Seeded ${data.products.length} products into Postgres.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
