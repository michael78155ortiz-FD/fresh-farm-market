// src/app/market/vendor/[id]/AddToCartForm.tsx
'use client'

import { useCartActions } from "@/components/cart/CartProvider";
import { useRouter } from "next/navigation";

type AddToCartFormProps = {
  product: {
    id: string;
    name: string;
    price_cents: number;
    image_url: string;
  };
  inStock: boolean;
  vendorId: string;
};

export default function AddToCartForm({ product, inStock, vendorId }: AddToCartFormProps) {
  const { add } = useCartActions();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!inStock) return;

    add({
      id: product.id,
      name: product.name,
      price: product.price_cents,
      imageUrl: product.image_url,
      vendorId: vendorId,
      quantity: 1,
    });

    // Redirect to cart page
    router.push("/cart");
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className={`w-full rounded-xl px-4 py-2 font-medium ${
          inStock
            ? "bg-green-600 text-white hover:bg-green-700"
            : "cursor-not-allowed bg-gray-300 text-gray-600"
        }`}
        disabled={!inStock}
      >
        {inStock ? "Add to Cart" : "Sold out"}
      </button>
    </form>
  );
}
