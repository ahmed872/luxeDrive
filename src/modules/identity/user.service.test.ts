import { beforeEach, describe, expect, it } from 'vitest';

import { db } from '@/modules/core';

import {
  createUser,
  getUserByEmail,
  getUserById,
  setUserActive,
  setUserRole,
  touchLastLogin,
  verifyAdminCredentials,
  verifyCustomerCredentials,
} from './user.service';
import { resetIdentityTables } from './testing';

beforeEach(async () => {
  await resetIdentityTables();
});

describe('createUser', () => {
  it('creates a user with a hashed password, never the plaintext', async () => {
    const user = await createUser({
      email: 'Owner@Example.com',
      password: 'correct-horse-9',
      role: 'OWNER',
    });
    expect(user.email).toBe('owner@example.com'); // normalized
    expect(user.passwordHash).not.toContain('correct-horse-9');
    expect(user.active).toBe(true);
  });

  it('rejects a duplicate email', async () => {
    await createUser({ email: 'a@example.com', password: 'correct-horse-9', role: 'STAFF' });
    await expect(
      createUser({ email: 'a@example.com', password: 'another-horse-9', role: 'STAFF' }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });
});

describe('getUserByEmail / getUserById', () => {
  it('finds a user case-insensitively by email', async () => {
    const user = await createUser({
      email: 'a@example.com',
      password: 'correct-horse-9',
      role: 'STAFF',
    });
    expect((await getUserByEmail('A@Example.com'))?.id).toBe(user.id);
    expect((await getUserById(user.id))?.email).toBe('a@example.com');
  });

  it('returns null for an unknown user', async () => {
    expect(await getUserByEmail('nobody@example.com')).toBeNull();
    expect(await getUserById('00000000-0000-0000-0000-000000000000')).toBeNull();
  });
});

describe('setUserActive / setUserRole', () => {
  it('disables and re-enables a user', async () => {
    const user = await createUser({
      email: 'a@example.com',
      password: 'correct-horse-9',
      role: 'STAFF',
    });
    const disabled = await setUserActive(user.id, false);
    expect(disabled.active).toBe(false);
    const reenabled = await setUserActive(user.id, true);
    expect(reenabled.active).toBe(true);
  });

  it('changes a role', async () => {
    const user = await createUser({
      email: 'a@example.com',
      password: 'correct-horse-9',
      role: 'STAFF',
    });
    const promoted = await setUserRole(user.id, 'MANAGER');
    expect(promoted.role).toBe('MANAGER');
  });

  it('rejects an id that does not exist', async () => {
    await expect(
      setUserActive('00000000-0000-0000-0000-000000000000', false),
    ).rejects.toMatchObject({
      code: 'NOT_FOUND',
    });
  });
});

describe('verifyAdminCredentials', () => {
  it('accepts a matching password for an active admin', async () => {
    await createUser({ email: 'owner@example.com', password: 'correct-horse-9', role: 'OWNER' });
    const result = await verifyAdminCredentials('owner@example.com', 'correct-horse-9');
    expect(result).toMatchObject({ ok: true });
  });

  it('rejects an unknown email', async () => {
    expect(await verifyAdminCredentials('nobody@example.com', 'whatever-12')).toEqual({
      ok: false,
      reason: 'NOT_FOUND',
    });
  });

  it('rejects a wrong password', async () => {
    await createUser({ email: 'owner@example.com', password: 'correct-horse-9', role: 'OWNER' });
    expect(await verifyAdminCredentials('owner@example.com', 'wrong-password-99')).toEqual({
      ok: false,
      reason: 'WRONG_PASSWORD',
    });
  });

  it('rejects a disabled admin even with the correct password', async () => {
    const user = await createUser({
      email: 'owner@example.com',
      password: 'correct-horse-9',
      role: 'OWNER',
    });
    await setUserActive(user.id, false);
    expect(await verifyAdminCredentials('owner@example.com', 'correct-horse-9')).toEqual({
      ok: false,
      reason: 'DISABLED',
    });
  });

  it('rejects a CUSTOMER account — a correct password alone is not an admin credential', async () => {
    await createUser({
      email: 'shopper@example.com',
      password: 'correct-horse-9',
      role: 'CUSTOMER',
    });
    expect(await verifyAdminCredentials('shopper@example.com', 'correct-horse-9')).toEqual({
      ok: false,
      reason: 'NOT_ADMIN',
    });
  });
});

/**
 * The customer twin of `verifyAdminCredentials` (P12 §2) — the mirror-image
 * separation check matters just as much here: an OWNER/MANAGER/STAFF
 * password must never authenticate the storefront's customer session, the
 * same way a customer's password must never authenticate the admin one.
 */
describe('verifyCustomerCredentials', () => {
  it('accepts a matching password for an active customer', async () => {
    await createUser({
      email: 'shopper@example.com',
      password: 'correct-horse-9',
      role: 'CUSTOMER',
    });
    expect(await verifyCustomerCredentials('shopper@example.com', 'correct-horse-9')).toMatchObject(
      { ok: true },
    );
  });

  it('rejects an unknown email', async () => {
    expect(await verifyCustomerCredentials('nobody@example.com', 'whatever-12')).toEqual({
      ok: false,
      reason: 'NOT_FOUND',
    });
  });

  it('rejects a wrong password', async () => {
    await createUser({
      email: 'shopper@example.com',
      password: 'correct-horse-9',
      role: 'CUSTOMER',
    });
    expect(await verifyCustomerCredentials('shopper@example.com', 'wrong-password-99')).toEqual({
      ok: false,
      reason: 'WRONG_PASSWORD',
    });
  });

  it('rejects a disabled customer even with the correct password', async () => {
    const user = await createUser({
      email: 'shopper@example.com',
      password: 'correct-horse-9',
      role: 'CUSTOMER',
    });
    await setUserActive(user.id, false);
    expect(await verifyCustomerCredentials('shopper@example.com', 'correct-horse-9')).toEqual({
      ok: false,
      reason: 'DISABLED',
    });
  });

  it('rejects an admin account — the mirror of admin login rejecting a customer', async () => {
    await createUser({ email: 'owner@example.com', password: 'correct-horse-9', role: 'OWNER' });
    expect(await verifyCustomerCredentials('owner@example.com', 'correct-horse-9')).toEqual({
      ok: false,
      reason: 'NOT_CUSTOMER',
    });
  });

  for (const role of ['MANAGER', 'STAFF'] as const) {
    it(`rejects a ${role} account the same way`, async () => {
      await createUser({
        email: `${role.toLowerCase()}@example.com`,
        password: 'correct-horse-9',
        role,
      });
      expect(
        await verifyCustomerCredentials(`${role.toLowerCase()}@example.com`, 'correct-horse-9'),
      ).toEqual({ ok: false, reason: 'NOT_CUSTOMER' });
    });
  }

  it('rejects an account with no password set, rather than throwing', async () => {
    const user = await createUser({
      email: 'shopper@example.com',
      password: 'correct-horse-9',
      role: 'CUSTOMER',
    });
    await db.user.update({ where: { id: user.id }, data: { passwordHash: null } });
    expect(await verifyCustomerCredentials('shopper@example.com', 'correct-horse-9')).toEqual({
      ok: false,
      reason: 'NO_PASSWORD',
    });
  });
});

describe('touchLastLogin', () => {
  it('sets lastLoginAt', async () => {
    const user = await createUser({
      email: 'a@example.com',
      password: 'correct-horse-9',
      role: 'STAFF',
    });
    expect(user.lastLoginAt).toBeNull();
    await touchLastLogin(user.id);
    expect((await getUserById(user.id))?.lastLoginAt).not.toBeNull();
  });
});
