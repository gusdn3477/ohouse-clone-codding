import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useCallback, memo, useMemo } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';

const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: { product: { id: number; title: string; price: number; thumbnail: string; brand: string }; quantity: number };
  onUpdateQuantity: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <Card className="flex gap-4 p-4">
      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-background-secondary">
        <Image
          src={item.product.thumbnail}
          alt={item.product.title}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-text-secondary mb-1">{item.product.brand}</p>
        <Link href={`/products/${item.product.id}`} legacyBehavior>
          <a className="font-medium text-text hover:text-primary line-clamp-2">{item.product.title}</a>
        </Link>
        <p className="font-bold text-text mt-2">${item.product.price.toFixed(2)}</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.product.id)}
          className="text-text-secondary hover:text-accent transition-colors"
          aria-label="삭제"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="flex items-center bg-background-secondary rounded-lg">
          <button
            className="w-8 h-8 text-text-secondary hover:text-text disabled:opacity-50"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold text-text">{item.quantity}</span>
          <button
            className="w-8 h-8 text-text-secondary hover:text-text"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
    </Card>
  );
});

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  // Memoized calculations
  const shippingFee = useMemo(() => (totalPrice >= 50 ? 0 : 5), [totalPrice]);
  const finalTotal = useMemo(() => totalPrice + shippingFee, [totalPrice, shippingFee]);
  const amountForFreeShipping = useMemo(() => Math.max(0, 50 - totalPrice), [totalPrice]);

  return (
    <>
      <Head>
        <title>장바구니 - 오늘의샵</title>
        <meta name="description" content="오늘의샵 장바구니" />
        <meta name="robots" content="noindex" />
      </Head>

      <div className="py-6 lg:py-8 min-h-[80vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-text mb-6">장바구니</h1>

          {items.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-text mb-2">장바구니가 비어있습니다</h2>
              <p className="text-text-secondary mb-6">마음에 드는 상품을 담아보세요!</p>
              <Link href="/products">
                <Button variant="primary">쇼핑하러 가기</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">{totalItems}개 상품</span>
                  <button
                    onClick={clearCart}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
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

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h3 className="font-bold text-text mb-4">주문 요약</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-text-secondary">
                      <span>상품 금액</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>배송비</span>
                      <span>{shippingFee === 0 ? '무료' : '$5.00'}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-text">
                      <span>총 결제금액</span>
                      <span className="text-lg">${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  {amountForFreeShipping > 0 && (
                    <p className="text-xs text-primary mt-3">
                      ${amountForFreeShipping.toFixed(2)} 더 구매하면 무료 배송!
                    </p>
                  )}
                  <Button variant="primary" fullWidth className="mt-6">결제하기</Button>
                  <Link href="/products">
                    <span className="block text-center text-sm text-text-secondary hover:text-primary mt-3 cursor-pointer">
                      쇼핑 계속하기
                    </span>
                  </Link>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
