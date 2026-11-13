import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  /** Sync name/price/availability with fresh menu data. */
  syncWithProducts: (products: Product[]) => void;
  clear: () => void;
}

export const MAX_ITEM_QUANTITY = 20;

const clamp = (n: number) => Math.max(1, Math.min(MAX_ITEM_QUANTITY, Math.round(n)));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          if (!product.isAvailable) return state;
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: clamp(i.quantity + quantity), isAvailable: true }
                  : i,
              ),
            };
          }
          const item: CartItem = {
            productId: product.id,
            name: product.name,
            image: product.imageUrl,
            unitPrice: product.price,
            quantity: clamp(quantity),
            isAvailable: product.isAvailable,
          };
          return { items: [...state.items, item] };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: clamp(quantity) } : i)),
        })),

      increment: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clamp(i.quantity + 1) } : i,
          ),
        })),

      decrement: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clamp(i.quantity - 1) } : i,
          ),
        })),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      syncWithProducts: (products) =>
        set((state) => {
          if (products.length === 0 || state.items.length === 0) return state;
          const byId = new Map(products.map((p) => [p.id, p]));
          let changed = false;
          const items = state.items.map((i) => {
            const p = byId.get(i.productId);
            // Product removed from the menu entirely → unavailable.
            const next: CartItem = p
              ? { ...i, name: p.name, image: p.imageUrl, unitPrice: p.price, isAvailable: p.isAvailable }
              : { ...i, isAvailable: false };
            if (
              next.name !== i.name ||
              next.image !== i.image ||
              next.unitPrice !== i.unitPrice ||
              next.isAvailable !== i.isAvailable
            ) {
              changed = true;
            }
            return next;
          });
          return changed ? { items } : state;
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: 'mck-cart',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

/* Selectors */
export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => (i.isAvailable ? sum + i.unitPrice * i.quantity : sum), 0);
