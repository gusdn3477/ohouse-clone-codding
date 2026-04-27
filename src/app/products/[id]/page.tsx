import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/features/product/ProductDetailClient';
import { getProduct, getProductsByCategory, getStaticProducts } from '@/server/catalog';

export const revalidate = 3600;

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProductByParams(params: Promise<{ id: string }>) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  try {
    return await getProduct(productId);
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const products = await getStaticProducts();
  return products.slice(0, 20).map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductByParams(params);

  if (!product) {
    return {
      title: '상품을 찾을 수 없습니다',
    };
  }

  const pageDescription = product.description.slice(0, 160);

  return {
    title: product.title,
    description: pageDescription,
    openGraph: {
      title: product.title,
      description: pageDescription,
      images: [product.thumbnail],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductByParams(params);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProductsByCategory(product.category)).products
    .filter((item) => item.id !== product.id)
    .slice(0, 4);
  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : product.price;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.images,
            brand: { '@type': 'Brand', name: product.brand },
            offers: {
              '@type': 'Offer',
              price: discountedPrice,
              priceCurrency: 'USD',
              availability:
                product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviews?.length ?? 0,
            },
          }),
        }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
