'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState, useTransition } from 'react';
import ProductCard from '@/components/features/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = useCallback(() => {
    startTransition(() => {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setShowToast(true);
    });

    setTimeout(() => setShowToast(false), 2500);
  }, [product, quantity, addItem]);

  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  const renderStars = useCallback((rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-200'}>
          ★
        </span>
      );
    }
    return stars;
  }, []);

  return (
    <div className="py-6 lg:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-text-secondary">
          <Link href="/" className="hover:text-primary">
            홈
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            스토어
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-primary"
          >
            {product.category}
          </Link>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="card relative aspect-square overflow-hidden">
              <Image
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      idx === selectedImage ? 'border-primary' : 'border-transparent'
                    }`}
                    aria-label={`${product.title} 이미지 ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-text-secondary">{product.brand}</p>
              <h1 className="text-2xl font-bold text-text lg:text-3xl">{product.title}</h1>
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
                  <span className="text-3xl font-bold text-text">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-text-tertiary line-through">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-text">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="leading-relaxed text-text-secondary">{product.description}</p>

            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-text-secondary">재고 {product.stock}개</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-500">품절</span>
                </>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <div className="flex items-center rounded-lg bg-background-secondary">
                <button
                  type="button"
                  className="h-12 w-12 text-xl font-semibold text-text-secondary hover:text-text disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="수량 감소"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-text">{quantity}</span>
                <button
                  type="button"
                  className="h-12 w-12 text-xl font-semibold text-text-secondary hover:text-text"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="수량 증가"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className={`btn-primary flex-1 ${isPending ? 'opacity-80' : ''}`}
                onClick={handleAddToCart}
                disabled={isPending || product.stock === 0}
              >
                {isPending ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    추가 중...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    장바구니 담기
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div className="text-center">
                <div className="mb-1 text-2xl">🚚</div>
                <p className="text-xs text-text-secondary">무료 배송</p>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl">🔄</div>
                <p className="text-xs text-text-secondary">30일 반품</p>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl">✅</div>
                <p className="text-xs text-text-secondary">정품 보증</p>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="mb-6 text-xl font-bold text-text">관련 상품</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>

      {showToast && (
        <div className="animate-slide-in fixed bottom-6 right-6 z-50 rounded-lg bg-text px-5 py-3 text-white shadow-lg">
          ✓ {quantity}개 상품이 장바구니에 추가되었습니다
        </div>
      )}
    </div>
  );
}
