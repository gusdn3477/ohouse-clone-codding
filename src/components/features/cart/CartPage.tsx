'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useMemo, useState } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useCart } from '@/context/CartContext';

type CheckoutResult = {
  orderId: string;
  total: number;
};

const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: {
    product: { id: number; title: string; price: number; thumbnail: string; brand: string };
    quantity: number;
  };
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-background-secondary">
        <Image
          src={item.product.thumbnail}
          alt={item.product.title}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs text-text-secondary">{item.product.brand}</p>
        <Link
          href={`/products/${item.product.id}`}
          className="line-clamp-2 font-medium text-text hover:text-primary"
        >
          {item.product.title}
        </Link>
        <p className="mt-2 font-bold text-text">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          type="button"
          onClick={() => onRemove(item.product.id)}
          className="text-text-secondary transition-colors hover:text-accent"
          aria-label="삭제"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex items-center rounded-lg bg-background-secondary">
          <button
            type="button"
            className="h-8 w-8 text-text-secondary hover:text-text disabled:opacity-50"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="수량 감소"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold text-text">{item.quantity}</span>
          <button
            type="button"
            className="h-8 w-8 text-text-secondary hover:text-text"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            aria-label="수량 증가"
          >
            +
          </button>
        </div>
      </div>
    </Card>
  );
});

CartItem.displayName = 'CartItem';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const shippingFee = useMemo(() => (totalPrice >= 50 ? 0 : 5), [totalPrice]);
  const finalTotal = useMemo(() => totalPrice + shippingFee, [totalPrice, shippingFee]);
  const amountForFreeShipping = useMemo(() => Math.max(0, 50 - totalPrice), [totalPrice]);

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    setCheckoutResult(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('checkout failed');
      }

      const result = (await response.json()) as CheckoutResult;
      setCheckoutResult(result);
    } catch {
      setCheckoutError('결제 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsCheckingOut(false);
    }
  }, [items]);

  return (
    <div className="min-h-[80vh] py-6 lg:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold text-text lg:text-3xl">장바구니</h1>

        {items.length === 0 ? (
          <Card className="py-16 text-center">
            <div className="mb-4 text-6xl">🛒</div>
            <h2 className="mb-2 text-xl font-bold text-text">장바구니가 비어있습니다</h2>
            <p className="mb-6 text-text-secondary">마음에 드는 상품을 담아보세요!</p>
            <Link href="/products" className="btn-primary">
              쇼핑하러 가기
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-text-secondary">{totalItems}개 상품</span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm text-text-secondary transition-colors hover:text-accent"
                >
                  전체 삭제
                </button>
              </div>
              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <h3 className="mb-4 font-bold text-text">주문 요약</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>상품 금액</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>배송비</span>
                    <span>{shippingFee === 0 ? '무료' : '$5.00'}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 font-bold text-text">
                    <span>총 결제금액</span>
                    <span className="text-lg">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                {amountForFreeShipping > 0 && (
                  <p className="mt-3 text-xs text-primary">
                    ${amountForFreeShipping.toFixed(2)} 더 구매하면 무료 배송!
                  </p>
                )}
                <Button
                  variant="primary"
                  fullWidth
                  className="mt-6"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? '처리 중...' : '결제하기'}
                </Button>
                {checkoutResult && (
                  <p className="mt-3 text-xs text-primary">
                    주문 요청 완료: {checkoutResult.orderId} · ${checkoutResult.total.toFixed(2)}
                  </p>
                )}
                {checkoutError && <p className="mt-3 text-xs text-accent">{checkoutError}</p>}
                <Link
                  href="/products"
                  className="mt-3 block cursor-pointer text-center text-sm text-text-secondary hover:text-primary"
                >
                  쇼핑 계속하기
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
