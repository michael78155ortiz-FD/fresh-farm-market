"use client";

import { add } from "@/lib/cart";

type Props = {
  id: string;
  vendor_id: string;
  name: string;
  price_cents: number;
};

export default function AddToCartButton({ id, vendor_id, name, price_cents }: Props) {
  return (
    <button
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
      onClick={() => {
        add({ product_id: id, vendor_id, name, price_cents, qty: 1 });
        alert("Added to cart");
      }}
    >
      Add to cart
    </button>
  );
}
