import { beforeEach, describe, expect, it } from 'vitest';

import {
  createUser,
  getUserByEmail,
  getUserById,
  setUserActive,
  setUserRole,
  touchLastLogin,
  verifyAdminCredentials,
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
