import { describe, expect, it } from 'vitest';

import {
  assertNoPublicSecrets,
  clientEnvSchema,
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
  // Required unconditionally (P06) — Auth.js session signing.
  AUTH_SECRET: 'b'.repeat(32),
  // Required unconditionally (P13) — protects the outbox dispatch endpoint.
  EMAIL_DISPATCH_SECRET: 'c'.repeat(32),
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
    const { NODE_ENV: _omit, ...rest } = validServer;
    const result = parseServerEnv(rest);
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

describe('parseServerEnv — authentication (P06)', () => {
  it('rejects a missing AUTH_SECRET, naming the variable', () => {
    const { AUTH_SECRET: _omit, ...rest } = validServer;
    const result = parseServerEnv(rest);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.message).toContain('AUTH_SECRET');
  });

  it('rejects an AUTH_SECRET shorter than 32 characters', () => {
    const result = parseServerEnv({ ...validServer, AUTH_SECRET: 'too-short' });
    expect(result.success).toBe(false);
  });

  it('accepts an optional AUTH_TRUST_HOST of "true" or "false" only', () => {
    expect(parseServerEnv({ ...validServer, AUTH_TRUST_HOST: 'true' }).success).toBe(true);
    expect(parseServerEnv({ ...validServer, AUTH_TRUST_HOST: 'yes' }).success).toBe(false);
  });
});

describe('parseServerEnv — email (P13)', () => {
  it('defaults EMAIL_PROVIDER to console', () => {
    const result = parseServerEnv(validServer);
    expect(result.success && result.data.EMAIL_PROVIDER).toBe('console');
  });

  it('rejects a missing EMAIL_DISPATCH_SECRET, naming the variable — required unconditionally', () => {
    const { EMAIL_DISPATCH_SECRET: _omit, ...rest } = validServer;
    const result = parseServerEnv(rest);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.message).toContain('EMAIL_DISPATCH_SECRET');
  });

  it('rejects an EMAIL_DISPATCH_SECRET shorter than 32 characters', () => {
    const result = parseServerEnv({ ...validServer, EMAIL_DISPATCH_SECRET: 'too-short' });
    expect(result.success).toBe(false);
  });

  it('accepts EMAIL_PROVIDER=console with nothing else set', () => {
    const result = parseServerEnv({ ...validServer, EMAIL_PROVIDER: 'console' });
    expect(result.success).toBe(true);
  });

  it('accepts EMAIL_PROVIDER=test with nothing else set', () => {
    const result = parseServerEnv({ ...validServer, EMAIL_PROVIDER: 'test' });
    expect(result.success).toBe(true);
  });

  it('rejects EMAIL_PROVIDER=smtp missing its required fields, naming every missing one', () => {
    const result = parseServerEnv({ ...validServer, EMAIL_PROVIDER: 'smtp' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message).toContain('EMAIL_SMTP_HOST');
      expect(result.message).toContain('EMAIL_SMTP_PORT');
      expect(result.message).toContain('EMAIL_FROM');
    }
  });

  it('accepts EMAIL_PROVIDER=smtp once host/port/from are present — auth is optional', () => {
    const result = parseServerEnv({
      ...validServer,
      EMAIL_PROVIDER: 'smtp',
      EMAIL_SMTP_HOST: 'smtp.example.com',
      EMAIL_SMTP_PORT: '587',
      EMAIL_FROM: 'no-reply@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a username with no matching password (or vice versa) — not a valid "unauthenticated relay" configuration', () => {
    const base = {
      ...validServer,
      EMAIL_PROVIDER: 'smtp' as const,
      EMAIL_SMTP_HOST: 'smtp.example.com',
      EMAIL_SMTP_PORT: '587',
      EMAIL_FROM: 'no-reply@example.com',
    };
    expect(parseServerEnv({ ...base, EMAIL_SMTP_USER: 'user' }).success).toBe(false);
    expect(parseServerEnv({ ...base, EMAIL_SMTP_PASSWORD: 'pw' }).success).toBe(false);
    expect(
      parseServerEnv({ ...base, EMAIL_SMTP_USER: 'user', EMAIL_SMTP_PASSWORD: 'pw' }).success,
    ).toBe(true);
  });

  it('rejects an EMAIL_FROM that is not an email address', () => {
    const result = parseServerEnv({ ...validServer, EMAIL_FROM: 'not-an-email' });
    expect(result.success).toBe(false);
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

describe('P06 security — no auth secret ever reaches the client env schema', () => {
  it('AUTH_SECRET is not a client-env key (it would be inlined into the browser bundle if it were)', () => {
    expect(Object.keys(clientEnvSchema.shape)).not.toContain('AUTH_SECRET');
  });

  it('the bootstrap-admin credentials are not parsed by any env schema at all — script-only, read directly from process.env', () => {
    const allKeys = [...Object.keys(serverEnvSchema.shape), ...Object.keys(clientEnvSchema.shape)];
    expect(allKeys).not.toContain('BOOTSTRAP_ADMIN_EMAIL');
    expect(allKeys).not.toContain('BOOTSTRAP_ADMIN_PASSWORD');
  });
});
