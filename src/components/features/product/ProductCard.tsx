'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useState, useTransition, memo, useCallback } from 'react';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      startTransition(() => {
        addItem(product);
        setShowToast(true);
      });

      setTimeout(() => setShowToast(false), 2000);
    },
    [addItem, product]
  );

  // 할인가 계산
  const discountedPrice = product.discountPercentage
    ? product.price * (1 - product.discountPercentage / 100)
    : null;

  // 별점 렌더링
  const renderStars = useCallback((rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-200'}>
          ★
        </span>
      );
    }
    return stars;
  }, []);

  return (
    <>
      <Card className="group overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-background-secondary">
          <Link
            href={`/products/${product.id}`}
            className="block h-full"
            aria-label={`${product.title} 상세 보기`}
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              className="transition-transform duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{
                objectFit: 'cover',
              }}
            />

            {product.discountPercentage > 0 && (
              <div className="absolute left-3 top-3">
                <Badge variant="discount">{Math.round(product.discountPercentage)}% OFF</Badge>
              </div>
            )}

            {/* Stock Badge */}
            {product.stock < 10 && product.stock > 0 && (
              <div className="absolute right-3 top-3">
                <Badge className="bg-yellow-500 text-white">재고 {product.stock}개</Badge>
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Badge variant="soldout" className="text-base">
                  품절
                </Badge>
              </div>
            )}
          </Link>

          {product.stock > 0 && (
            <button
              type="button"
              className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
                isPending
                  ? 'bg-primary text-white'
                  : 'translate-y-2 bg-white text-text-secondary opacity-0 hover:bg-primary hover:text-white group-hover:translate-y-0 group-hover:opacity-100'
              }`}
              onClick={handleAddToCart}
              disabled={isPending}
              aria-label={`${product.title} 장바구니 담기`}
            >
              {isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              )}
            </button>
          )}
        </div>

        <Link href={`/products/${product.id}`} className="block space-y-2 p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
            {product.brand}
          </span>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-text transition-colors group-hover:text-primary">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-xs">{renderStars(product.rating)}</div>
            <span className="text-xs text-text-secondary">({product.rating.toFixed(1)})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            {discountedPrice ? (
              <>
                <span className="text-lg font-bold text-accent">${discountedPrice.toFixed(2)}</span>
                <span className="price-original">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-text">${product.price.toFixed(2)}</span>
            )}
          </div>
        </Link>
      </Card>

      {/* Toast */}
      {showToast && (
        <div className="animate-slide-in fixed bottom-6 right-6 z-50 rounded-lg bg-text px-5 py-3 text-white shadow-lg">
          ✓ 장바구니에 추가되었습니다
        </div>
      )}
    </>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
