'use client';

import * as React from 'react';

import type { ProductDetail } from '@/modules/catalog';
import type { Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/dictionary';
import { VariantSelector } from '@/components/storefront/pdp/variant-selector';
import { WishlistToggleButton } from '@/components/storefront/wishlist-toggle-button';
import { ProductPrice } from '@/components/commerce/product-price';
import { StockBadge } from '@/components/commerce/stock-badge';
import { QuantitySelector } from '@/components/commerce/quantity-selector';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { ShoppingBag, Zap } from 'lucide-react';

export interface PurchasePanelProps {
  product: ProductDetail;
  locale: Locale;
  currency: string;
}

/**
 * Owns the one piece of client state a PDP actually needs: which variant is
 * selected. Price, stock and SKU displayed here always come from that
 * variant's own server-computed data (`resolveEffectivePrice`/
 * `resolveVariantStockStatus`, already run in `getProductDetailBySlug`) —
 * never recomputed or guessed in the browser (P05 §18: never trust the
 * client for price, variant, or stock).
 */
export function PurchasePanel({ product, locale, currency }: PurchasePanelProps) {
  const t = getDictionary(locale);
  const [selectedVariant, setSelectedVariant] = React.useState(
    product.variants.find((v) => v.id === product.defaultVariantId),
  );
  const [quantity, setQuantity] = React.useState(1);

  const maxQuantity = selectedVariant
    ? Math.max(1, Math.min(10, selectedVariant.stockQuantity || 10))
    : 1;
  const outOfStock = !selectedVariant || selectedVariant.stockStatus === 'out-of-stock';

  const notAvailableYet = () =>
    toast({
      title: t.product.cartComingSoonTitle,
      description: t.product.cartComingSoonDescription,
      variant: 'default',
    });

  return (
    <div className="flex flex-col gap-5">
      {selectedVariant ? (
        <div className="flex items-center gap-3">
          <ProductPrice
            priceMinor={selectedVariant.price.currentMinor}
            compareAtMinor={selectedVariant.price.compareAtMinor}
            currency={currency}
            locale={locale}
            className="text-h4"
          />
          <StockBadge status={selectedVariant.stockStatus} locale={locale} />
        </div>
      ) : (
        <p className="text-small text-(--color-error)">
          {locale === 'ar' ? 'هذا الخيار غير متوفر' : 'This combination is unavailable'}
        </p>
      )}

      <VariantSelector
        options={product.options}
        variants={product.variants}
        defaultVariantId={product.defaultVariantId}
        locale={locale}
        onVariantChange={setSelectedVariant}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <p className="text-sm font-medium text-(--color-text)">{t.product.quantity}</p>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={maxQuantity}
          disabled={outOfStock}
          decreaseLabel={locale === 'ar' ? 'إنقاص الكمية' : 'Decrease quantity'}
          increaseLabel={locale === 'ar' ? 'زيادة الكمية' : 'Increase quantity'}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          size="lg"
          className="flex-1 gap-2"
          disabled={outOfStock}
          onClick={notAvailableYet}
        >
          <ShoppingBag aria-hidden="true" />
          {t.product.addToCart}
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="flex-1 gap-2"
          disabled={outOfStock}
          onClick={notAvailableYet}
        >
          <Zap aria-hidden="true" />
          {t.product.buyNow}
        </Button>
        <WishlistToggleButton
          productId={product.id}
          addLabel={t.product.wishlistAdd}
          removeLabel={t.product.wishlistRemove}
          className="static size-12 shrink-0 self-center border border-(--color-border) bg-(--color-surface) shadow-none sm:self-auto"
        />
      </div>

      <div className="flex flex-col gap-1 border-t border-(--color-border) pt-4 text-caption text-(--color-text-muted)">
        <p>
          {t.product.sku}: <span className="tabular-nums">{selectedVariant?.sku ?? '—'}</span>
        </p>
        <p>{t.product.shippingInfo}</p>
      </div>
    </div>
  );
}
