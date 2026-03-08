import type { ComponentType } from 'react';
import type { Product } from '@/types';

export type AppEvent =
  | {
      type: 'cart/addItem';
      product: Product;
      quantity?: number;
    }
  | {
      type: 'cart/removeItem';
      productId: number;
    }
  | {
      type: 'cart/clear';
    }
  | {
      type: 'search/submit';
      term: string;
    }
  | {
      type: 'search/historyChanged';
      items: string[];
    };

export interface CartSummary {
  itemKinds: number;
  totalItems: number;
  totalPrice: number;
}

export interface RecentSearchesState {
  items: string[];
  hydrated: boolean;
}

export interface DomainPageEntry<Props = Record<string, unknown>> {
  default: ComponentType<Props>;
}
