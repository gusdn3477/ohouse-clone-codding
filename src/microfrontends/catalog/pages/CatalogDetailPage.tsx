import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState, useTransition } from 'react';
import ProductCard from '@/components/features/product/ProductCard';
import { dispatchAddToCart } from '@/microfrontends/cart/public';
import { useProduct, useProductsByCategory } from '../api/hooks';

export interface CatalogDetailPageProps {
  productId: number;
}

export default function CatalogDetailPage({ productId }: CatalogDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const { data: product } = useProduct(productId);
  const { data: categoryProducts = [] } = useProductsByCategory(product?.category ?? null);

  const relatedProducts = categoryProducts.filter((item) => item.id !== productId).slice(0, 4);

  const handleAddToCart = useCallback(() => {
    if (!product) {
      return;
    }

    startTransition(() => {
      dispatchAddToCart(product, quantity);
      setShowToast(true);
    });

    setTimeout(() => setShowToast(false), 2500);
  }, [product, quantity]);

  const discountedPrice = product?.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  const renderStars = useCallback((rating: number) => {
    const stars = [];
    for (let index = 0; index < 5; index += 1) {
      stars.push(
        <span key={index} className={index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}>
          ★
        </span>
      );
    }
    return stars;
  }, []);

  if (!product) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const pageTitle = `${product.title} | 오늘의샵`;
  const pageDescription = product.description.slice(0, 160);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={product.thumbnail} />
        <meta property="og:type" content="product" />
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
                price: discountedPrice ?? product.price,
                priceCurrency: 'USD',
                availability:
                  product.stock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviews?.length ?? 0,
              },
            }),
          }}
        />
      </Head>

      <div className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 mb-6 text-sm text-text-secondary">
            <Link href="/" legacyBehavior>
              <a className="hover:text-primary">홈</a>
            </Link>
            <span>/</span>
            <Link href="/products" legacyBehavior>
              <a className="hover:text-primary">스토어</a>
            </Link>
            <span>/</span>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} legacyBehavior>
              <a className="hover:text-primary">{product.category}</a>
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="card aspect-square overflow-hidden">
                <Image
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImage ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-text-secondary font-medium mb-2">{product.brand}</p>
                <h1 className="text-2xl lg:text-3xl font-bold text-text">{product.title}</h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-lg">{renderStars(product.rating)}</div>
                <span className="font-semibold text-text">{product.rating.toFixed(1)}</span>
                <span className="text-text-secondary">({product.reviews?.length ?? 0}개 리뷰)</span>
              </div>

              <div className="flex items-baseline gap-3">
                {discountedPrice ? (
                  <>
                    <span className="text-sm font-bold text-accent">
                      {Math.round(product.discountPercentage)}%
                    </span>
                    <span className="text-3xl font-bold text-text">${discountedPrice.toFixed(2)}</span>
                    <span className="text-lg text-text-tertiary line-through">${product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-text">${product.price.toFixed(2)}</span>
                )}
              </div>

              <p className="text-text-secondary leading-relaxed">{product.description}</p>

              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-text-secondary">재고 {product.stock}개</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-sm text-red-500">품절</span>
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <div className="flex items-center bg-background-secondary rounded-lg">
                  <button
                    className="w-12 h-12 text-xl font-semibold text-text-secondary hover:text-text disabled:opacity-50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-text">{quantity}</span>
                  <button
                    className="w-12 h-12 text-xl font-semibold text-text-secondary hover:text-text"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className={`flex-1 btn-primary ${isPending ? 'opacity-80' : ''}`}
                  onClick={handleAddToCart}
                  disabled={isPending || product.stock === 0}
                >
                  {isPending ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      추가 중...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      장바구니 담기
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl mb-1">🚚</div>
                  <p className="text-xs text-text-secondary">무료 배송</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🔄</div>
                  <p className="text-xs text-text-secondary">30일 반품</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">✅</div>
                  <p className="text-xs text-text-secondary">정품 보증</p>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="text-xl font-bold text-text mb-6">관련 상품</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>

        {showToast && (
          <div className="fixed bottom-6 right-6 px-5 py-3 bg-text text-white rounded-lg shadow-lg z-50 animate-slide-in">
            ✓ {quantity}개 상품이 장바구니에 추가되었습니다
          </div>
        )}
      </div>
    </>
  );
}
