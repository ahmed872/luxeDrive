import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Inter } from 'next/font/google';

import { clientEnv } from '@/modules/core/env.client';

import './globals.css';

/**
 * Root layout.
 *
 * Direction and language are resolved on the server so the page never renders
 * left-to-right and then flips (ADR-023). Locale-prefixed routing
 * (`/ar/...`, `/en/...`) arrives with the storefront in P05; until then the
 * default locale from the environment decides.
 *
 * Two font families cover the two scripts (`--font-latin`, `--font-arabic`);
 * `globals.css` picks the right stack per `:lang()` so mixed Arabic/Latin
 * content — a price inside an Arabic sentence — still renders each script in
 * its intended face instead of one face's fallback glyphs for the other.
 */

const latin = Inter({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LuxeDrive',
  description: 'Production foundation.',
  robots: { index: false, follow: false },
};

/**
 * Applied before hydration via a blocking inline script: reading the theme
 * choice out of `localStorage` and painting `data-theme` on `<html>` has to
 * happen before first paint, or the page flashes the wrong theme for a frame.
 * This is the one deliberate exception to "no inline script" — it is static,
 * has no external input, and runs strictly before React attaches.
 */
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('luxedrive-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = clientEnv().NEXT_PUBLIC_DEFAULT_LOCALE;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${latin.variable} ${arabic.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
