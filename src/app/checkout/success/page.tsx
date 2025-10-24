// src/app/checkout/success/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartActions } from "@/components/cart/CartProvider";

export default function SuccessPage() {
  const { clear } = useCartActions();

  useEffect(() => {
    // Clear cart on mount
    clear();

    // Also clear localStorage directly to avoid hydration mismatches
    try {
      localStorage.removeItem("cart");
    } catch (e) {
      console.error("Failed to clear cart from localStorage", e);
    }
  }, [clear]); // ✅ include `clear` in deps

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="mb-2 text-3xl font-bold">🎉 Order Confirmed</h1>
      <p className="mb-6 text-gray-600">
        Thanks for your purchase! A confirmation email is on the way.
      </p>
      <Link
        href="/market"
        className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-3 font-semibold text-white shadow hover:bg-gray-800"
      >
        Continue shopping
      </Link>
    </main>
  );
}
