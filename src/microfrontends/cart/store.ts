import { useEffect } from 'react';
import { BehaviorSubject, filter } from 'rxjs';
import type { CartItem, CartState, Product } from '@/types';
import { appEvents$, publishAppEvent } from '@/microfrontends/shared/bus';
import type { AppEvent, CartSummary } from '@/microfrontends/shared/contracts';
import { useObservableState } from '@/microfrontends/shared/react';

const STORAGE_KEY = 'cart';

interface CartStoreState extends CartState {
  hydrated: boolean;
}

const emptyCartState: CartStoreState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  hydrated: false,
};

const cartState$ = new BehaviorSubject<CartStoreState>(emptyCartState);
export const cartSummary$ = new BehaviorSubject<CartSummary>({
  itemKinds: 0,
  totalItems: 0,
  totalPrice: 0,
});

let hasInitialized = false;
let hasBoundEventBus = false;

function calculateTotals(items: CartItem[]) {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.product.price * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}

function toSummary(state: CartStoreState): CartSummary {
  return {
    itemKinds: state.items.length,
    totalItems: state.totalItems,
    totalPrice: state.totalPrice,
  };
}

function syncDerivedState(state: CartStoreState) {
  cartState$.next(state);
  cartSummary$.next(toSummary(state));
}

function persistCart(items: CartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function updateState(items: CartItem[], hydrated = true) {
  const totals = calculateTotals(items);
  const nextState: CartStoreState = {
    items,
    hydrated,
    totalItems: totals.totalItems,
    totalPrice: totals.totalPrice,
  };

  if (hydrated) {
    persistCart(items);
  }

  syncDerivedState(nextState);
}

function addItem(product: Product, quantity = 1) {
  const currentItems = cartState$.getValue().items;
  const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);
  const safeQuantity = Math.max(1, quantity);

  const nextItems =
    existingIndex >= 0
      ? currentItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        )
      : [...currentItems, { product, quantity: safeQuantity }];

  updateState(nextItems);
}

function removeItem(productId: number) {
  updateState(cartState$.getValue().items.filter((item) => item.product.id !== productId));
}

function handleCartEvent(event: AppEvent) {
  switch (event.type) {
    case 'cart/addItem':
      addItem(event.product, event.quantity);
      break;
    case 'cart/removeItem':
      removeItem(event.productId);
      break;
    case 'cart/clear':
      updateState([]);
      break;
    default:
      break;
  }
}

function bindEventBus() {
  if (hasBoundEventBus) {
    return;
  }

  hasBoundEventBus = true;
  appEvents$
    .pipe(filter((event): event is Extract<AppEvent, { type: `cart/${string}` }> => event.type.startsWith('cart/')))
    .subscribe(handleCartEvent);
}

export function ensureCartStoreReady() {
  bindEventBus();

  if (hasInitialized || typeof window === 'undefined') {
    return;
  }

  hasInitialized = true;

  try {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (!savedCart) {
      syncDerivedState({ ...emptyCartState, hydrated: true });
      return;
    }

    const items = JSON.parse(savedCart) as CartItem[];
    updateState(items, true);
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    syncDerivedState({ ...emptyCartState, hydrated: true });
  }
}

export function useCartStoreState() {
  const state = useObservableState(cartState$);

  useEffect(() => {
    ensureCartStoreReady();
  }, []);

  return state;
}

export function useCartSummary() {
  const summary = useObservableState(cartSummary$);

  useEffect(() => {
    ensureCartStoreReady();
  }, []);

  return summary;
}

export function dispatchAddToCart(product: Product, quantity = 1) {
  ensureCartStoreReady();
  publishAppEvent({ type: 'cart/addItem', product, quantity });
}

export function dispatchRemoveFromCart(productId: number) {
  ensureCartStoreReady();
  publishAppEvent({ type: 'cart/removeItem', productId });
}

export function dispatchClearCart() {
  ensureCartStoreReady();
  publishAppEvent({ type: 'cart/clear' });
}

export function setCartItemQuantity(productId: number, quantity: number) {
  ensureCartStoreReady();

  if (quantity <= 0) {
    dispatchRemoveFromCart(productId);
    return;
  }

  const nextItems = cartState$.getValue().items.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );

  updateState(nextItems);
}
