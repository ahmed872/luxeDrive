import 'server-only';

import type { Prisma } from '@generated/prisma';

import { db } from '@/modules/core';

/**
 * Identity-relevant events on the existing `AuditLog` table (no schema
 * change needed — it was already generic: `action` + `entityType` +
 * `entityId` + optional before/after snapshots).
 *
 * Never pass a password, token, or hash into `before`/`after` — this log is
 * read by admins investigating account activity, not a place secrets ever
 * belong, even hashed.
 */

export type AuditAction =
  | 'auth.login.success'
  | 'auth.login.failure'
  | 'auth.logout'
  | 'user.role_changed'
  | 'user.disabled'
  | 'user.enabled'
  | 'user.created'
  // P07 — admin catalog management. `userId` here is always the actor (the
  // admin who did it); catalog rows have no "subject user" the way an
  // account event does.
  | 'product.created'
  | 'product.updated'
  | 'product.published'
  | 'product.archived'
  | 'product.deleted'
  | 'category.created'
  | 'category.updated'
  | 'category.deleted'
  | 'brand.created'
  | 'brand.updated'
  | 'brand.deleted'
  | 'attribute_definition.created'
  | 'attribute_definition.updated'
  | 'attribute_definition.deleted'
  | 'variant.created'
  | 'variant.updated'
  | 'variant.deleted'
  // P08 — inventory and pricing. Stock and price are the two numbers a
  // dispute is argued over, so each movement is its own event rather than a
  // generic `variant.updated`: "who set this to 3, and why" has to be
  // answerable from the log alone.
  | 'inventory.adjusted'
  | 'inventory.policy_changed'
  | 'price.updated'
  | 'price.bulk_updated';

/** Every entity type an audit event can be about — `entityType` is a plain
 * string column at the DB level (no enum constraint), but a fixed union
 * here keeps every call site naming a real, spelled-consistently type
 * rather than free-typing "Products" in one place and "product" in another. */
export type AuditEntityType =
  'User' | 'Product' | 'Category' | 'Brand' | 'AttributeDefinition' | 'Variant';

export interface RecordAuditEventInput {
  action: AuditAction;
  /** Defaults to `'User'` — every P06 call site is a `User`-subject event
   * and none of them pass this explicitly; P07's catalog events always do. */
  entityType?: AuditEntityType;
  /** The user the event happened to (subject) for a `User`-entityType event,
   * or the acting admin for every other entity type. Nullable because a
   * failed login against an email that doesn't exist has no user row to
   * attach to. */
  userId?: string | null;
  entityId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ip?: string | null;
}

export async function recordAuditEvent(input: RecordAuditEventInput): Promise<void> {
  await db.auditLog.create({
    data: {
      action: input.action,
      entityType: input.entityType ?? 'User',
      entityId: input.entityId ?? input.userId ?? null,
      userId: input.userId ?? null,
      before: input.before as Prisma.InputJsonValue | undefined,
      after: input.after as Prisma.InputJsonValue | undefined,
      ip: input.ip ?? null,
    },
  });
}
