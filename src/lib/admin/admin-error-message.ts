import { toAppError, type AppError } from '@/modules/core';
import { getAdminDictionary } from '@/lib/i18n/admin-dictionary';
import type { Locale } from '@/lib/i18n/locales';

/**
 * `AppError.messageFor(locale)` is deliberately generic per error `code` —
 * exactly right for a customer-facing storefront (P05/P06's login flow:
 * never hint at *why* a mutation failed). An admin tool is the opposite
 * case: P07 explicitly asks that blocking a delete happen "with clear
 * handling" (§4/§13) — an admin needs to know *which* N products are still
 * assigned, not just "conflict."
 *
 * Every P07 domain function that needs a more specific message throws with
 * `details: { reasonCode, count? }` — a fixed, locale-free slug, never
 * prose (see `category.service.ts#deleteCategory`,
 * `brand.service.ts#deleteBrand`, `variant.service.ts`, …). This is the one
 * place that gets turned into an actual bilingual sentence, via
 * `admin-dictionary.ts`'s `errors` section — domain services stay free of
 * any language's copy, the same separation `AppError.userMessage` already
 * draws at the top level. Falls back to the error code's own generic
 * message when there's no known `reasonCode`.
 */
export function adminErrorMessage(error: unknown, locale: Locale): string {
  const appError: AppError = toAppError(error);
  const reasonCode = appError.details?.reasonCode;
  const errors = getAdminDictionary(locale).errors as Record<string, string>;

  if (typeof reasonCode === 'string' && reasonCode in errors) {
    const count = appError.details?.count;
    return typeof count === 'number'
      ? errors[reasonCode]!.replace('{count}', String(count))
      : errors[reasonCode]!;
  }

  return appError.messageFor(locale);
}
