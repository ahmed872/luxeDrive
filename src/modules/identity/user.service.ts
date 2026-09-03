import 'server-only';

import type { Role, User } from '@generated/prisma';

import { db, AppError } from '@/modules/core';

import { hashPassword, verifyPassword } from './password';
import { isAdminRole } from './permissions';
import { mapUniqueConstraint } from './prisma-errors';

/**
 * The User domain: identity, credential, status, and role — the one place
 * every other identity concern (sessions, RBAC, audit) reads "who is this
 * and what may they do" from.
 */

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string | null;
  role: Role;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return db.user.findUnique({ where: { email: normalizeEmail(email) } });
}

export async function getUserById(id: string): Promise<User | null> {
  return db.user.findUnique({ where: { id } });
}

/**
 * The staff accounts an admin screen can filter or attribute by — every
 * role that can act on the store, customers excluded.
 *
 * Selected down to id/name/email/role on purpose: this feeds a filter
 * dropdown and an "who did this" column, and neither has any business
 * receiving a password hash. Never widen this to the whole `User` row.
 */
export async function listStaffUsers(): Promise<
  { id: string; name: string | null; email: string; role: Role }[]
> {
  return db.user.findMany({
    where: { role: { not: 'CUSTOMER' } },
    select: { id: true, name: true, email: true, role: true },
    orderBy: [{ name: 'asc' }, { email: 'asc' }],
  });
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const passwordHash = await hashPassword(input.password);
  try {
    return await db.user.create({
      data: {
        email: normalizeEmail(input.email),
        passwordHash,
        name: input.name ?? null,
        role: input.role,
      },
    });
  } catch (error) {
    throw mapUniqueConstraint(error, 'email');
  }
}

export async function setUserActive(id: string, active: boolean): Promise<User> {
  const user = await getUserById(id);
  if (!user) throw new AppError('NOT_FOUND', { details: { entity: 'User', id } });
  return db.user.update({ where: { id }, data: { active } });
}

export async function setUserRole(id: string, role: Role): Promise<User> {
  const user = await getUserById(id);
  if (!user) throw new AppError('NOT_FOUND', { details: { entity: 'User', id } });
  return db.user.update({ where: { id }, data: { role } });
}

export type CredentialFailureReason =
  'NOT_FOUND' | 'NO_PASSWORD' | 'WRONG_PASSWORD' | 'DISABLED' | 'NOT_ADMIN';

export type VerifyCredentialsResult =
  { ok: true; user: User } | { ok: false; reason: CredentialFailureReason };

/**
 * Verifies email + password for the admin login flow specifically: beyond a
 * matching password, the account must be active and hold an admin role
 * (`STAFF`/`MANAGER`/`OWNER`) — a `CUSTOMER` account, even with a correct
 * password, is not an admin-area credential.
 *
 * Every failure branch is distinguished only for internal logging
 * (`auth.ts` records the `reason` to the audit log); the caller-facing
 * message is always the same generic "invalid credentials" text (see
 * `auth.ts`) so a failed login never tells an attacker *which* fact was
 * wrong.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<VerifyCredentialsResult> {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false, reason: 'NOT_FOUND' };
  if (!user.passwordHash) return { ok: false, reason: 'NO_PASSWORD' };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, reason: 'WRONG_PASSWORD' };

  if (!user.active) return { ok: false, reason: 'DISABLED' };
  if (!isAdminRole(user.role)) return { ok: false, reason: 'NOT_ADMIN' };

  return { ok: true, user };
}

export async function touchLastLogin(id: string): Promise<void> {
  await db.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
}

export type VerifyCustomerFailureReason =
  'NOT_FOUND' | 'NO_PASSWORD' | 'WRONG_PASSWORD' | 'DISABLED' | 'NOT_CUSTOMER';

export type VerifyCustomerCredentialsResult =
  { ok: true; user: User } | { ok: false; reason: VerifyCustomerFailureReason };

/**
 * The storefront twin of `verifyAdminCredentials` (P12 §5): same shape,
 * same generic-failure discipline, but the role gate runs the other way —
 * an admin account, even with a correct password, is not a storefront
 * credential. `NOT_CUSTOMER` covers it, and like `NOT_ADMIN` above, only
 * ever reaches an audit log, never the caller.
 */
export async function verifyCustomerCredentials(
  email: string,
  password: string,
): Promise<VerifyCustomerCredentialsResult> {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false, reason: 'NOT_FOUND' };
  if (!user.passwordHash) return { ok: false, reason: 'NO_PASSWORD' };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, reason: 'WRONG_PASSWORD' };

  if (!user.active) return { ok: false, reason: 'DISABLED' };
  if (user.role !== 'CUSTOMER') return { ok: false, reason: 'NOT_CUSTOMER' };

  return { ok: true, user };
}
