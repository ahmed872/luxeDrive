import type { Locale } from '@/modules/core/money';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/components/commerce/product-image';
import { ProductPrice } from '@/components/commerce/product-price';
import { DiscountBadge } from '@/components/commerce/discount-badge';
import { StockBadge, type StockStatus } from '@/components/commerce/stock-badge';
import { Rating } from '@/components/commerce/rating';

export interface ProductCardProps {
  href: string;
  name: string;
  image?: { src: string; alt: string } | null;
  priceMinor: number;
  compareAtMinor?: number | null;
  currency?: string;
  locale?: Locale;
  ratingValue?: number;
  ratingCount?: number;
  stockStatus?: StockStatus;
  className?: string;
}

/**
 * Purely presentational: the grid tile used across storefront listing pages.
 * Add-to-cart, wishlist toggling and stock/pricing rules live in `cart` and
 * `pricing` — this component only renders what it's given.
 */
export function ProductCard({
  href,
  name,
  image,
  priceMinor,
  compareAtMinor,
  currency,
  locale,
  ratingValue,
  ratingCount,
  stockStatus,
  className,
}: ProductCardProps) {
  const percentOff =
    compareAtMinor && compareAtMinor > priceMinor
      ? ((compareAtMinor - priceMinor) / compareAtMinor) * 100
      : 0;

  return (
    <a
      href={href}
      className={cn(
        'group flex flex-col gap-3 rounded-(--radius-surface) p-2 outline-none',
        'transition-colors duration-(--duration-fast) focus-visible:ring-2 focus-visible:ring-(--color-ring)/25',
        className,
      )}
    >
      <div className="relative">
        <ProductImage
          src={image?.src}
          alt={image?.alt ?? name}
          className="transition-transform duration-(--duration-slow) ease-(--ease-standard) group-hover:scale-[1.02]"
          noImageLabel={locale === 'en' ? 'No image' : undefined}
        />
        {percentOff > 0 ? (
          <DiscountBadge percentOff={percentOff} className="absolute top-2 start-2" />
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="line-clamp-2 text-sm font-medium text-(--color-text)">{name}</p>

        {ratingValue !== undefined ? (
          <Rating value={ratingValue} count={ratingCount} locale={locale} />
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <ProductPrice
            priceMinor={priceMinor}
            compareAtMinor={compareAtMinor}
            currency={currency}
            locale={locale}
          />
          {stockStatus && stockStatus !== 'in-stock' ? (
            <StockBadge status={stockStatus} locale={locale} />
          ) : null}
        </div>
      </div>
    </a>
  );
}
