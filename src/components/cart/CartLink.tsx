// src/components/cart/CartLink.tsx
"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Shopping cart"
    >
      <span className="text-xl">🛒</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}