import Image from 'next/image';
import { ImageOff } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Shown in place of the image when `src` is empty. Defaults to Arabic (the store default locale). */
  noImageLabel?: string;
}

/**
 * A single product image with a fixed 1:1 frame and a token-styled fallback
 * when no image exists yet — the common state for a product mid-catalog-entry.
 * Visual only: no cropping/zoom/upload logic, that belongs to `catalog`.
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
  noImageLabel = 'لا توجد صورة',
}: ProductImageProps) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden rounded-(--radius-surface) bg-(--color-surface-raised)',
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? '(min-width: 1024px) 25vw, 50vw'}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-(--color-text-muted)">
          <ImageOff className="size-6" aria-hidden="true" />
          <span className="text-caption">{noImageLabel}</span>
        </div>
      )}
    </div>
  );
}
