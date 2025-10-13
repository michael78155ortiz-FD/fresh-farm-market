// src/components/market/ProductImage.tsx
"use client";

import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center text-xs text-gray-500">
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}