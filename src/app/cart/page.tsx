// src/app/cart/page.tsx
"use client";

import { money } from "@/lib/format";
import { useCart, useCartActions } from "@/components/cart/CartProvider";
import CartLine from "@/components/cart/CartLine";

export default function CartPage() {
  const { state, subtotal } = useCart();
  const { clear } = useCartActions();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {state.items.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center text-gray-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {state.items.map((it) => (
            <CartLine key={`${it.id}-${it.variantId ?? "_"}`} id={it.id} variantId={it.variantId} />
          ))}

          <div className="mt-6 rounded-2xl border p-6 bg-white">
            <div className="flex items-center justify-between text-lg">
              <span>Subtotal</span>
              <span className="font-semibold">{money(subtotal, state.currency)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Taxes and fees calculated at checkout.</p>
            <div className="mt-6 flex gap-3">
              <a
                href="/checkout"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-semibold shadow bg-black text-white"
              >
                Checkout
              </a>
              <button
                onClick={() => clear()}
                className="inline-flex items-center justify-center rounded-2xl px-4 py-3 font-semibold border"
              >
                Clear cart
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}