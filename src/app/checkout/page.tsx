"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

function money(cents: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format((cents || 0) / 100);
  } catch {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format((cents || 0) / 100);
  }
}

export default function CheckoutPage() {
  const { state } = useCart();
  const [loading, setLoading] = useState(false);

  const subtotal = useMemo(
    () => (state.items || []).reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  // ⬇️ This is the function you asked about. It lives INSIDE the component.
  async function handlePay() {
    try {
      setLoading(true);

      // 1) Ask the server to create a Stripe Checkout Session
      const res = await fetch("/api/checkout/sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: state.items }), // <-- your cart items
      });

      // 2) Don’t choke on HTML error pages
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      // 3) Handle server errors (e.g., out of stock)
      if (!res.ok) {
        alert(data?.error || "Checkout failed. Please try again.");
        return;
      }

      // 4) NEW: tell user if quantities were reduced due to low stock
      if (Array.isArray(data.reduced) && data.reduced.length > 0) {
        alert(
          "We adjusted quantities due to low stock. Please review your order on Stripe."
        );
      }

      // 5) Go to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("No checkout URL returned. Please try again.");
      }
    } catch (err: any) {
      alert(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Link href="/cart" className="text-sm text-gray-600 hover:underline">
          ← Back to Cart
        </Link>
      </div>

      {(!state.items || state.items.length === 0) ? (
        <div className="rounded-2xl border bg-white p-6">
          Your cart is empty.
          <div className="mt-4">
            <Link
              href="/market"
              className="inline-block rounded-xl bg-black px-4 py-2 text-white"
            >
              Browse products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y rounded-2xl border bg-white">
            {state.items.map((i) => (
              <li key={`${i.id}-${i.variantId ?? "base"}`} className="flex items-center gap-4 p-4">
                {i.imageUrl ? (
                  <img
                    src={i.imageUrl}
                    alt={i.name}
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-gray-100" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{i.name}</div>
                  <div className="text-sm text-gray-600">
                    {i.quantity} × {money(i.price)}
                  </div>
                </div>
                <div className="text-right font-medium">
                  {money(i.price * i.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
            <div className="text-gray-600">Subtotal</div>
            <div className="text-lg font-semibold">{money(subtotal)}</div>
          </div>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? "Creating checkout..." : "Pay now"}
          </button>
        </div>
      )}
    </main>
  );
}
