// src/components/SafeImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useMemo } from 'react';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
  fallbackSrc: string;
};

/**
 * SafeImage
 * - Uses `unoptimized` so Next.js doesn't prefetch the remote URL on the server.
 * - That removes the "upstream image response failed ... 404" logs.
 * - If the real image fails in the browser, we swap to the fallback.
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc,
  fill,
  ...rest
}: Props) {
  const [failed, setFailed] = useState(false);

  // decide which URL to try
  const finalSrc = useMemo(() => {
    return !failed && src ? src : fallbackSrc;
  }, [failed, src, fallbackSrc]);

  // For `fill`, Next/Image needs `fill` + no width/height. Otherwise, pass a default size.
  if (fill) {
    return (
      <Image
        {...rest}
        alt={alt}
        src={finalSrc}
        fill
        unoptimized // ← key line
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      {...rest}
      alt={alt}
      src={finalSrc}
      width={(rest as any).width ?? 400}
      height={(rest as any).height ?? 300}
      unoptimized // ← key line
      onError={() => setFailed(true)}
    />
  );
}
