import type { Metadata } from 'next';
import Link from 'next/link';

import { getCartView } from '@/modules/cart';
import { isLocale, type Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/dictionary';
import { resolveCartOwnerForRead } from '@/lib/cart/cart-identity';
import { StorefrontBreadcrumbs } from '@/components/storefront/listing/storefront-breadcrumbs';
import { CheckoutClient } from '@/components/storefront/checkout/checkout-client';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Checkout reads a personal, recalculated cart, so it is never cached — the
 * same reasoning as the cart page (P09 §23). The rest of the storefront keeps
 * its ISR.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'ar';
  return {
    title: getDictionary(locale).checkout.title,
    // A checkout page carries someone's basket and belongs in no index.
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'ar';
  const t = getDictionary(locale);

  const cart = await getCartView(await resolveCartOwnerForRead());

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <StorefrontBreadcrumbs
        locale={locale}
        trail={[{ label: t.cart.title, href: `/${locale}/cart` }, { label: t.checkout.title }]}
      />

      <h1 className="text-h3 text-(--color-text)">{t.checkout.title}</h1>

      {cart.lines.length === 0 ? (
        <EmptyState
          title={t.checkout.emptyTitle}
          description={t.checkout.emptyBody}
          action={
            <Button asChild>
              <Link href={`/${locale}/cart`}>{t.checkout.backToCart}</Link>
            </Button>
          }
        />
      ) : (
        <CheckoutClient cart={cart} locale={locale} />
      )}
    </div>
  );
}
