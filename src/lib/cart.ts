"use client";

export type CartItem = {
  product_id: string;
  vendor_id: string;
  name: string;
  price_cents: number;
  qty: number;
};

const KEY = "ffl_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

// ---- main ops ----
export function getCart(): CartItem[] {
  return read();
}

export function clearCart(): void {
  write([]);
}

export function add(item: CartItem): void {
  const items = read();
  const idx = items.findIndex((i) => i.product_id === item.product_id);
  if (idx >= 0) {
    items[idx].qty += item.qty;
  } else {
    items.push(item);
  }
  write(items);
}

// Optional helpers to satisfy any older imports:
export function setCart(items: CartItem[]) {
  write(items);
}
export const addToCart = add;

// Convenience object (so `cart.add(...)` also works)
export const cart = { get: getCart, add, clear: clearCart, set: setCart };

export default cart;
