import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getOptionalUser } from '@/modules/identity';
import { findCustomerForUser } from '@/modules/customers';
import { listCustomerOrders } from '@/modules/orders';
import { formatMoney } from '@/modules/core';
import { isLocale, type Locale } from '@/lib/i18n/locales';
import { getDictionary } from '@/lib/i18n/dictionary';
import { OrderStatusBadge } from '@/components/storefront/orders/order-status-badges';
import { formatOrderDate } from '@/components/storefront/orders/order-detail';
import { StorefrontBreadcrumbs } from '@/components/storefront/listing/storefront-breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

/**
 * A customer's own orders.
 *
 * The customer id comes from the session and goes into the query, so the list
 * is scoped by construction — there is no order id in the URL to substitute
 * (P10 §15).
 */

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'ar';
  return { title: getDictionary(locale).orders.myOrders, robots: { index: false, follow: false } };
}

export default async function AccountOrdersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'ar';
  const t = getDictionary(locale).orders;

  const user = await getOptionalUser();
  if (!user) redirect(`/${locale}`);
  const customer = await findCustomerForUser(user.id);
  if (!customer) redirect(`/${locale}`);

  const query = await searchParams;
  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;
  const page = Number.parseInt(pageParam ?? '1', 10);

  const orders = await listCustomerOrders(customer.id, {
    page: Number.isFinite(page) && page > 0 ? page : 1,
  });

  return (
    <div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <StorefrontBreadcrumbs locale={locale} trail={[{ label: t.myOrders }]} />
      <h1 className="text-h3 text-(--color-text)">{t.myOrders}</h1>

      {orders.items.length === 0 ? (
        <EmptyState
          title={t.noOrders}
          description={t.noOrdersBody}
          action={
            <Button asChild>
              <Link href={`/${locale}`}>{getDictionary(locale).cart.continueShopping}</Link>
            </Button>
          }
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.items.map((order) => (
            <li key={order.number}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <Link
                      href={`/${locale}/account/orders/${order.number}`}
                      className="font-mono text-small text-(--color-text) underline-offset-4 hover:underline"
                      dir="ltr"
                    >
                      {order.number}
                    </Link>
                    <span className="text-caption text-(--color-text-muted)">
                      {formatOrderDate(order.placedAt, locale)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-caption text-(--color-text-muted)">
                      {t.itemsCount.replace('{count}', String(order.itemCount))}
                    </span>
                    <OrderStatusBadge status={order.status} locale={locale} />
                    <span className="text-small font-semibold tabular-nums text-(--color-text)">
                      {formatMoney(order.totalMinor, { currency: order.currency, locale })}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${locale}/account/orders/${order.number}`}>{t.view}</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {orders.pageCount > 1 ? (
        <nav className="flex items-center justify-center gap-2" aria-label={t.myOrders}>
          {Array.from({ length: orders.pageCount }, (_, index) => index + 1).map((number) => (
            <Button
              key={number}
              asChild
              size="sm"
              variant={number === orders.page ? 'primary' : 'ghost'}
            >
              <Link
                href={`/${locale}/account/orders?page=${number}`}
                aria-current={number === orders.page ? 'page' : undefined}
              >
                {number}
              </Link>
            </Button>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
