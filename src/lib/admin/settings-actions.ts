'use server';

import { revalidatePath } from 'next/cache';

import { adminErrorMessage } from '@/lib/admin/admin-error-message';
import { recordAuditEvent, requirePermission } from '@/modules/identity';
import { updateStoreSettings, type StoreSettingsInput } from '@/modules/settings';
import type { Locale } from '@/lib/i18n/locales';
import type { ActionResult } from '@/lib/admin/action-result';

/**
 * Store settings (P15) — one row, one action.
 *
 * Same shape as every other admin action file: `requirePermission` first,
 * then the domain service, then an audit event, then revalidate. Two things
 * are specific to this one:
 *
 *   - **`settings.manage` is not a catalog permission.** STAFF holds none of
 *     it; a MANAGER does. The check is what enforces that, not the sidebar.
 *   - **Revalidation is broad on purpose.** The store's name, currency and
 *     branding are rendered by *every* storefront page, so a settings save
 *     is the one admin write that legitimately invalidates the whole
 *     storefront rather than one list — `revalidatePath('/', 'layout')`
 *     covers the locale tree beneath it. Every other action here stays
 *     targeted precisely because it does not have that reach.
 */
export async function updateStoreSettingsAction(
  input: StoreSettingsInput,
  expectedUpdatedAt: Date | null,
  locale: Locale,
): Promise<ActionResult<{ updatedAt: Date | null }>> {
  try {
    const actor = await requirePermission('settings.manage');

    const updated = await updateStoreSettings(input, expectedUpdatedAt);

    await recordAuditEvent({
      action: 'settings.updated',
      entityType: 'StoreSettings',
      userId: actor.id,
      // Never the whole row: `contact` carries the store's own phone and
      // address, and an audit entry is read by more people than the form
      // is. The fields worth answering "who changed this" about are the
      // ones that change what customers are charged and what the store is
      // called.
      after: {
        storeNameEn: updated.storeNameEn,
        storeNameAr: updated.storeNameAr,
        currency: updated.currency,
        defaultLocale: updated.defaultLocale,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/admin/settings');

    return { ok: true, data: { updatedAt: updated.updatedAt } };
  } catch (error) {
    return { ok: false, error: adminErrorMessage(error, locale) };
  }
}
