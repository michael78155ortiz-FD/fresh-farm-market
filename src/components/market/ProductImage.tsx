// src/components/market/ProductImage.tsx
import Image from "next/image";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackEmoji?: string; // e.g. "🥬"
};

export default function ProductImage({ src, alt, className, fallbackEmoji = "🥬" }: Props) {
  return (
    <div className={`relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${className ?? ""}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-6xl">{fallbackEmoji}</span>
        </div>
      )}
    </div>
  );
}
