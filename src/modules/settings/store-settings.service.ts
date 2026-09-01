import { db } from '@/modules/core';
import { getMediaAsset, toImageProp, type ResolvedMediaImage } from '@/modules/media';

/**
 * Single-row store identity (ADR-015) — currency, name, branding, SEO
 * defaults. Everything storefront/checkout/receipts/emails reads from here
 * rather than a scattered `process.env.STORE_NAME` or a hardcoded string,
 * so changing the store's name or currency is a data change, not a
 * deployment.
 */

export interface StoreSettingsView {
  storeNameAr: string;
  storeNameEn: string;
  logo: ResolvedMediaImage | null;
  logoDark: ResolvedMediaImage | null;
  favicon: ResolvedMediaImage | null;
  // Dynamic brand-colour theming (`StoreSettings.brandColor` /
  // `brandColorSecondary`) is a later-phase (admin branding) concern — P05's
  // storefront renders entirely from the P02 design system's static tokens,
  // so those two columns aren't surfaced here yet. Add them when a real
  // consumer needs them, rather than carrying an unused hex value through
  // application code (which `no-restricted-syntax` also wouldn't allow as a
  // literal — see `docs/environments.md` / `eslint.config.mjs`).
  currency: string;
  defaultLocale: 'ar' | 'en';
  contact: { phone?: string; email?: string; address?: string };
  socialLinks: Record<string, string>;
  seoDefaults: {
    titleAr?: string;
    titleEn?: string;
    descriptionAr?: string;
    descriptionEn?: string;
  };
  whatsappNumber: string | null;
}

/**
 * Used only when no `StoreSettings` row exists yet — a fresh database
 * before the (future, admin-authored) settings row is created, and in unit
 * tests that don't seed one. Never silently swapped for a real row's data;
 * every field a real row would carry is present here too, so a caller can't
 * tell "no settings yet" from "settings say so" by a field going missing.
 */
const FALLBACK_SETTINGS: Omit<StoreSettingsView, 'logo' | 'logoDark' | 'favicon'> = {
  storeNameAr: 'لوكس درايف',
  storeNameEn: 'LuxeDrive',
  currency: 'SAR',
  defaultLocale: 'ar',
  contact: {},
  socialLinks: {},
  seoDefaults: {},
  whatsappNumber: null,
};

async function resolveLogo(
  mediaId: string | null,
  locale: 'ar' | 'en',
): Promise<ResolvedMediaImage | null> {
  if (!mediaId) return null;
  const asset = await getMediaAsset(mediaId);
  return asset ? toImageProp(asset, locale) : null;
}

/**
 * A plain, uncached read — request-level and cross-instance caching is the
 * app layer's job (`unstable_cache`/route `revalidate`, per P05's caching
 * pass), not something this service hides from its callers or its tests.
 */
export async function getStoreSettings(locale: 'ar' | 'en' = 'ar'): Promise<StoreSettingsView> {
  const row = await db.storeSettings.findFirst();
  if (!row) return { ...FALLBACK_SETTINGS, logo: null, logoDark: null, favicon: null };

  return {
    storeNameAr: row.storeNameAr,
    storeNameEn: row.storeNameEn,
    logo: await resolveLogo(row.logoMediaId, locale),
    logoDark: await resolveLogo(row.logoDarkMediaId, locale),
    favicon: await resolveLogo(row.faviconMediaId, locale),
    currency: row.currency,
    defaultLocale: row.defaultLocale === 'AR' ? 'ar' : 'en',
    contact: (row.contact ?? {}) as StoreSettingsView['contact'],
    socialLinks: (row.socialLinks ?? {}) as StoreSettingsView['socialLinks'],
    seoDefaults: (row.seoDefaults ?? {}) as StoreSettingsView['seoDefaults'],
    whatsappNumber: row.whatsappNumber,
  };
}
