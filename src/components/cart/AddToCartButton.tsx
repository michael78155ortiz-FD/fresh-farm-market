// src/components/cart/AddToCartButton.tsx
"use client";

import { useCartActions, CartItem } from "@/components/cart/CartProvider";
import { useState } from "react";

interface AddToCartButtonProps {
  item: CartItem;
}

export default function AddToCartButton({ item }: AddToCartButtonProps) {
  const { add } = useCartActions();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    add(item);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isAdded
          ? "bg-green-100 text-green-700"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      <span className="text-lg">🛒</span>
      {isAdded ? "Added!" : "Add to Cart"}
    </button>
  );
}