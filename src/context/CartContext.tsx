import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/api';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; product: Product }
    | { type: 'REMOVE_ITEM'; productId: number }
    | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; items: CartItem[] };

interface CartContextType extends CartState {
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    return items.reduce(
        (acc, item) => ({
            totalItems: acc.totalItems + item.quantity,
            totalPrice: acc.totalPrice + item.product.price * item.quantity,
        }),
        { totalItems: 0, totalPrice: 0 }
    );
}

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingIndex = state.items.findIndex(
                (item) => item.product.id === action.product.id
            );
            let newItems: CartItem[];
            if (existingIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...state.items, { product: action.product, quantity: 1 }];
            }
            return { ...state, items: newItems, ...calculateTotals(newItems) };
        }
        case 'REMOVE_ITEM': {
            const newItems = state.items.filter(
                (item) => item.product.id !== action.productId
            );
            return { ...state, items: newItems, ...calculateTotals(newItems) };
        }
        case 'UPDATE_QUANTITY': {
            if (action.quantity <= 0) {
                const newItems = state.items.filter(
                    (item) => item.product.id !== action.productId
                );
                return { ...state, items: newItems, ...calculateTotals(newItems) };
            }
            const newItems = state.items.map((item) =>
                item.product.id === action.productId
                    ? { ...item, quantity: action.quantity }
                    : item
            );
            return { ...state, items: newItems, ...calculateTotals(newItems) };
        }
        case 'CLEAR_CART':
            return { items: [], totalItems: 0, totalPrice: 0 };
        case 'LOAD_CART':
            return { ...state, items: action.items, ...calculateTotals(action.items) };
        default:
            return state;
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        totalItems: 0,
        totalPrice: 0,
    });

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const items = JSON.parse(savedCart);
                dispatch({ type: 'LOAD_CART', items });
            } catch (e) {
                console.error('Failed to load cart from localStorage');
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    const addItem = (product: Product) => dispatch({ type: 'ADD_ITEM', product });
    const removeItem = (productId: number) => dispatch({ type: 'REMOVE_ITEM', productId });
    const updateQuantity = (productId: number, quantity: number) =>
        dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    return (
        <CartContext.Provider
            value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
