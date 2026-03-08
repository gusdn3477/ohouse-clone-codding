import type { ReactNode } from 'react';
import type { Product } from '@/types';
import {
  dispatchAddToCart,
  dispatchClearCart,
  dispatchRemoveFromCart,
} from '@/microfrontends/cart/public';
import { setCartItemQuantity, useCartStoreState } from '@/microfrontends/cart/store';

export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCart() {
  const { items, totalItems, totalPrice } = useCartStoreState();

  return {
    items,
    totalItems,
    totalPrice,
    addItem: (product: Product) => dispatchAddToCart(product),
    removeItem: (productId: number) => dispatchRemoveFromCart(productId),
    updateQuantity: (productId: number, quantity: number) => setCartItemQuantity(productId, quantity),
    clearCart: () => dispatchClearCart(),
  };
}
