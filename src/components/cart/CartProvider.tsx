// src/components/cart/CartProvider.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  vendorId?: string;
  variantId?: string | null;
  quantity: number;
  options?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  currency: string;
}

interface CartContextValue {
  state: CartState;
  subtotal: number;
  itemCount: number;
}

interface CartActionsContextValue {
  add: (item: CartItem) => void;
  setQty: (id: string, quantity: number, variantId?: string | null) => void;
  remove: (id: string, variantId?: string | null) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CartActionsContext = createContext<CartActionsContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({
    items: [],
    currency: "USD",
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setState(parsed);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const add = (item: CartItem) => {
    setState((prev) => {
      const items = prev.items || [];
      const existing = items.find(
        (i) => i.id === item.id && (i.variantId ?? null) === (item.variantId ?? null)
      );
      if (existing) {
        return {
          ...prev,
          items: items.map((i) =>
            i.id === item.id && (i.variantId ?? null) === (item.variantId ?? null)
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { ...prev, items: [...items, item] };
    });
  };

  const setQty = (id: string, quantity: number, variantId?: string | null) => {
    if (quantity <= 0) {
      remove(id, variantId);
      return;
    }
    setState((prev) => ({
      ...prev,
      items: (prev.items || []).map((i) =>
        i.id === id && (i.variantId ?? null) === (variantId ?? null)
          ? { ...i, quantity }
          : i
      ),
    }));
  };

  const remove = (id: string, variantId?: string | null) => {
    setState((prev) => ({
      ...prev,
      items: (prev.items || []).filter(
        (i) => !(i.id === id && (i.variantId ?? null) === (variantId ?? null))
      ),
    }));
  };

  const clear = () => {
    setState((prev) => ({ ...prev, items: [] }));
  };

  const subtotal = (state.items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = (state.items || []).reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, subtotal, itemCount }}>
      <CartActionsContext.Provider value={{ add, setQty, remove, clear }}>
        {children}
      </CartActionsContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function useCartActions() {
  const context = useContext(CartActionsContext);
  if (!context) {
    throw new Error("useCartActions must be used within CartProvider");
  }
  return context;
}