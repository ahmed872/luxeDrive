'use server';

import { revalidatePath } from 'next/cache';

import { adminErrorMessage } from '@/lib/admin/admin-error-message';
import { requirePermission } from '@/modules/identity';
import { recordAuditEvent } from '@/modules/identity';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryInput,
  type CategoryUpdateInput,
} from '@/modules/catalog';
import type { Locale } from '@/lib/i18n/locales';
import type { ActionResult } from '@/lib/admin/action-result';

export async function createCategoryAction(
  input: CategoryInput,
  locale: Locale,
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requirePermission('categories.manage');
    const category = await createCategory(input);
    await recordAuditEvent({
      action: 'category.created',
      entityType: 'Category',
      userId: user.id,
      entityId: category.id,
      after: { slug: category.slug, nameEn: category.nameEn },
    });
    revalidatePath('/admin/categories');
    return { ok: true, data: { id: category.id } };
  } catch (error) {
    return { ok: false, error: adminErrorMessage(error, locale) };
  }
}

export async function updateCategoryAction(
  id: string,
  input: CategoryUpdateInput,
  locale: Locale,
): Promise<ActionResult> {
  try {
    const user = await requirePermission('categories.manage');
    const category = await updateCategory(id, input);
    await recordAuditEvent({
      action: 'category.updated',
      entityType: 'Category',
      userId: user.id,
      entityId: category.id,
      after: input as Record<string, unknown>,
    });
    revalidatePath('/admin/categories');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: adminErrorMessage(error, locale) };
  }
}

export async function deleteCategoryAction(id: string, locale: Locale): Promise<ActionResult> {
  try {
    const user = await requirePermission('categories.manage');
    await deleteCategory(id);
    await recordAuditEvent({
      action: 'category.deleted',
      entityType: 'Category',
      userId: user.id,
      entityId: id,
    });
    revalidatePath('/admin/categories');
    return { ok: true };
  } catch (error) {
    return { ok: false, error: adminErrorMessage(error, locale) };
  }
}
