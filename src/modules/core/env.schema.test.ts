import { describe, expect, it } from 'vitest';

import {
  assertNoPublicSecrets,
  parseClientEnv,
  parseServerEnv,
  serverEnvSchema,
} from './env.schema';

const validServer = {
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  // STORAGE_PROVIDER defaults to 'local', which requires this (P04) —
  // omitting it is exactly what the "missing signing secret" test below
  // covers, so the general-purpose "valid environment" fixture needs it.
  MEDIA_UPLOAD_SIGNING_SECRET: 'a'.repeat(32),
};

describe('parseServerEnv', () => {
  it('accepts a valid environment', () => {
    const result = parseServerEnv(validServer);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.DATABASE_URL).toBe(validServer.DATABASE_URL);
      expect(result.data.NODE_ENV).toBe('test');
    }
  });

  it('defaults NODE_ENV to development', () => {
    const result = parseServerEnv({
      DATABASE_URL: validServer.DATABASE_URL,
      MEDIA_UPLOAD_SIGNING_SECRET: validServer.MEDIA_UPLOAD_SIGNING_SECRET,
    });
    expect(result.success && result.data.NODE_ENV).toBe('development');
  });

  it('fails when DATABASE_URL is missing, naming the variable', () => {
    const result = parseServerEnv({ NODE_ENV: 'test' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.message).toContain('DATABASE_URL');
  });

  it('rejects a DATABASE_URL that is not a postgres connection string', () => {
    const result = parseServerEnv({ ...validServer, DATABASE_URL: 'mysql://localhost/db' });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown NODE_ENV rather than guessing', () => {
    const result = parseServerEnv({ ...validServer, NODE_ENV: 'staging' });
    expect(result.success).toBe(false);
  });
});

describe('parseServerEnv — media storage (P04)', () => {
  it('defaults STORAGE_PROVIDER to local', () => {
    const result = parseServerEnv(validServer);
    expect(result.success && result.data.STORAGE_PROVIDER).toBe('local');
  });

  it('rejects the local provider without a signing secret, naming the variable', () => {
    const { MEDIA_UPLOAD_SIGNING_SECRET: _omit, ...rest } = validServer;
    const result = parseServerEnv(rest);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.message).toContain('MEDIA_UPLOAD_SIGNING_SECRET');
  });

  it('rejects the s3 provider missing its required credentials, naming every missing one', () => {
    const result = parseServerEnv({ ...validServer, STORAGE_PROVIDER: 's3' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain('STORAGE_BUCKET');
      expect(result.message).toContain('STORAGE_ACCESS_KEY_ID');
      expect(result.message).toContain('STORAGE_SECRET_ACCESS_KEY');
    }
  });

  it('accepts the s3 provider once all its required credentials are present — no fake defaults fill them in', () => {
    const result = parseServerEnv({
      ...validServer,
      STORAGE_PROVIDER: 's3',
      STORAGE_BUCKET: 'luxedrive-media',
      STORAGE_ACCESS_KEY_ID: 'AKIAEXAMPLE',
      STORAGE_SECRET_ACCESS_KEY: 'secret-example',
    });
    expect(result.success).toBe(true);
  });
});

describe('parseClientEnv', () => {
  it('accepts a valid public environment', () => {
    const result = parseClientEnv({
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
      NEXT_PUBLIC_DEFAULT_LOCALE: 'ar',
    });
    expect(result.success).toBe(true);
  });

  it('defaults the locale to Arabic (ADR-023)', () => {
    const result = parseClientEnv({ NEXT_PUBLIC_SITE_URL: 'https://example.com' });
    expect(result.success && result.data.NEXT_PUBLIC_DEFAULT_LOCALE).toBe('ar');
  });

  it('rejects a site URL that is not a URL', () => {
    const result = parseClientEnv({ NEXT_PUBLIC_SITE_URL: 'example.com' });
    expect(result.success).toBe(false);
  });
});

describe('assertNoPublicSecrets', () => {
  it('passes for the real server schema', () => {
    expect(() => assertNoPublicSecrets(Object.keys(serverEnvSchema.shape))).not.toThrow();
  });

  it('catches a secret that was given a NEXT_PUBLIC_ name', () => {
    expect(() => assertNoPublicSecrets(['DATABASE_URL', 'NEXT_PUBLIC_STRIPE_SECRET'])).toThrow(
      /NEXT_PUBLIC_STRIPE_SECRET/,
    );
  });
});
