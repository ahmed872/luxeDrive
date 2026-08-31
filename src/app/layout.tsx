import type { Metadata } from 'next';

import { clientEnv } from '@/modules/core/env.client';

import './globals.css';

/**
 * Root layout.
 *
 * Direction and language are resolved on the server so the page never renders
 * left-to-right and then flips (ADR-023). Locale-prefixed routing
 * (`/ar/...`, `/en/...`) arrives with the storefront in P05; until then the
 * default locale from the environment decides.
 */

export const metadata: Metadata = {
  title: 'LuxeDrive',
  description: 'Production foundation.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = clientEnv().NEXT_PUBLIC_DEFAULT_LOCALE;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
