import Link from 'next/link';

import { formatMoney } from '@/modules/core/money';
import { getCachedCategoryTree, getCachedStoreSettings } from '@/lib/cached-queries';
import { getDictionary } from '@/lib/i18n/dictionary';
import type { Locale } from '@/lib/i18n/locales';

export interface StorefrontFooterProps {
  locale: Locale;
}

export async function StorefrontFooter({ locale }: StorefrontFooterProps) {
  const t = getDictionary(locale);
  const [settings, categories] = await Promise.all([
    getCachedStoreSettings(locale),
    getCachedCategoryTree(),
  ]);
  const storeName = locale === 'ar' ? settings.storeNameAr : settings.storeNameEn;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface-raised)">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-h6 font-bold text-(--color-text)">{storeName}</p>
          <p className="text-small text-(--color-text-muted)">
            {locale === 'ar'
              ? `الأسعار بعملة ${settings.currency} وتشمل الضريبة عند الاقتضاء.`
              : `Prices in ${settings.currency}, tax included where applicable.`}
          </p>
          {settings.whatsappNumber ? (
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              className="tabular-nums text-small text-(--color-primary) hover:underline"
            >
              {settings.whatsappNumber}
            </a>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-label text-(--color-text-muted) uppercase">{t.nav.allCategories}</p>
          <ul className="flex flex-col gap-1.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/${locale}/c/${category.slug}`}
                  className="text-small text-(--color-text-muted) transition-colors duration-(--duration-fast) hover:text-(--color-text)"
                >
                  {locale === 'ar' ? category.nameAr : category.nameEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-label text-(--color-text-muted) uppercase">
            {locale === 'ar' ? 'مثال سعر' : 'Sample price'}
          </p>
          <p className="tabular-nums text-small text-(--color-text-muted)">
            {formatMoney(199_900, { currency: settings.currency, locale })}
          </p>
        </div>
      </div>

      <div className="border-t border-(--color-border) px-4 py-4 text-center text-caption text-(--color-text-muted) sm:px-6">
        © {year} {storeName}
      </div>
    </footer>
  );
}
