"use client";
import { useEffect } from "react";
import { useCartActions, useCart } from "@/components/cart/CartProvider";
import Link from "next/link";

export default function SuccessPage() {
  const { clear } = useCartActions();
  const { itemCount } = useCart();

  useEffect(() => {
    // Clear immediately on mount, no ref needed
    clear();
    
    // Also clear localStorage directly to prevent hydration issues
    try {
      localStorage.removeItem("cart");
    } catch (e) {
      console.error("Failed to clear cart from localStorage", e);
    }
  }, []); // Empty deps - only run once on mount

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-2">🎉 Order Confirmed</h1>
      <p className="text-gray-600 mb-6">
        Thanks for your purchase! A confirmation email is on the way.
      </p>
      <Link
        href="/market"
        className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-semibold shadow bg-black text-white hover:bg-gray-800"
      >
        Continue shopping
      </Link>
    </main>
  );
}
