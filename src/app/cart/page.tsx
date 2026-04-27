import type { Metadata } from 'next';
import CartPage from '@/components/features/cart/CartPage';

export const metadata: Metadata = {
  title: '장바구니',
  description: '오늘의샵 장바구니',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartRoutePage() {
  return <CartPage />;
}
