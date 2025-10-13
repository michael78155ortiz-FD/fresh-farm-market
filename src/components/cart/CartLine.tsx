// src/components/cart/CartLine.tsx
"use client";

import Image from "next/image";
import { money } from "@/lib/format";
import { useCart, useCartActions } from "@/components/cart/CartProvider";

export default function CartLine({ id, variantId }: { id: string; variantId?: string | null }) {
  const { state } = useCart();
  const { setQty, remove } = useCartActions();
  const item = state.items.find(
    (i) => i.id === id && (i.variantId ?? null) === (variantId ?? null)
  );
  if (!item) return null;
  const lineTotal = item.price * item.quantity;

  return (
    <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-3 rounded-xl border bg-white">
      <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
            No image
          </div>
        )}
      </div>

      <div>
        <div className="font-medium">{item.name}</div>
        {item.options && (
          <div className="text-xs text-gray-500">
            {Object.entries(item.options).map(([k, v]) => (
              <span key={k} className="mr-2">
                {k}: {v}
              </span>
            ))}
          </div>
        )}
        <div className="text-sm text-gray-700">{money(item.price)}</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setQty(item.id, Math.max(1, item.quantity - 1), item.variantId)}
          className="h-8 w-8 rounded-lg border flex items-center justify-center"
          aria-label={`Decrease ${item.name}`}
        >
          −
        </button>
        <input
          value={item.quantity}
          onChange={(e) =>
            setQty(item.id, Math.max(1, Number(e.target.value) || 1), item.variantId)
          }
          className="h-8 w-12 text-center rounded-lg border"
          inputMode="numeric"
          aria-label={`${item.name} quantity`}
        />
        <button
          onClick={() => setQty(item.id, item.quantity + 1, item.variantId)}
          className="h-8 w-8 rounded-lg border flex items-center justify-center"
          aria-label={`Increase ${item.name}`}
        >
          +
        </button>
        <button
          onClick={() => remove(item.id, item.variantId)}
          className="ml-3 text-sm text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>

      <div className="col-span-3 text-right text-sm text-gray-600">
        Line total: {money(lineTotal)}
      </div>
    </div>
  );
}