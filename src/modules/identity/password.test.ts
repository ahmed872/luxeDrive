import { describe, expect, it } from 'vitest';

import { hashPassword, validatePasswordPolicy, verifyPassword } from './password';

describe('hashPassword / verifyPassword', () => {
  it('verifies the correct password against its own hash', async () => {
    const hash = await hashPassword('correct-horse-battery-9');
    expect(await verifyPassword('correct-horse-battery-9', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('correct-horse-battery-9');
    expect(await verifyPassword('wrong-password-attempt-1', hash)).toBe(false);
  });

  it('never stores the password in plaintext', async () => {
    const password = 'correct-horse-battery-9';
    const hash = await hashPassword(password);
    expect(hash).not.toContain(password);
  });

  it('salts every hash differently, even for the same password', async () => {
    const a = await hashPassword('same-password-12345');
    const b = await hashPassword('same-password-12345');
    expect(a).not.toBe(b);
    expect(await verifyPassword('same-password-12345', a)).toBe(true);
    expect(await verifyPassword('same-password-12345', b)).toBe(true);
  });

  it('rejects a malformed or unrecognized stored hash rather than throwing', async () => {
    expect(await verifyPassword('anything', 'not-a-real-hash')).toBe(false);
    expect(await verifyPassword('anything', 'md5:deadbeef')).toBe(false);
    expect(await verifyPassword('anything', '')).toBe(false);
  });
});

describe('validatePasswordPolicy', () => {
  it('accepts a password meeting the policy', () => {
    expect(validatePasswordPolicy('correct-horse-9')).toBeNull();
  });

  it('rejects a password shorter than 12 characters', () => {
    expect(validatePasswordPolicy('short1')).toMatch(/12/);
  });

  it('rejects a password with no number', () => {
    expect(validatePasswordPolicy('allletters-nodigits')).toMatch(/number/);
  });

  it('rejects a password with no letter', () => {
    expect(validatePasswordPolicy('123456789012')).toMatch(/letter/);
  });
});
