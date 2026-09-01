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
  | 'user.created';

export interface RecordAuditEventInput {
  action: AuditAction;
  /** The user the event happened to (subject), not necessarily the actor —
   * for login events they're the same person; for role changes they may
   * differ once P07 adds an actor-vs-subject distinction. Nullable because a
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
      entityType: 'User',
      entityId: input.entityId ?? input.userId ?? null,
      userId: input.userId ?? null,
      before: input.before as Prisma.InputJsonValue | undefined,
      after: input.after as Prisma.InputJsonValue | undefined,
      ip: input.ip ?? null,
    },
  });
}
