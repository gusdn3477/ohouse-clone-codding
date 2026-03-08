import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('@/microfrontends/cart/public').then((module) => module.CartPage), {
  loading: () => <div className="py-16 text-center text-text-secondary">장바구니를 불러오는 중...</div>,
});

export default CartPage;
