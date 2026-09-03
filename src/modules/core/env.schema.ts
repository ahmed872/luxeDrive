import { z } from 'zod';

/**
 * Environment contract.
 *
 * Split deliberately in two: anything in `serverEnvSchema` is a secret or a
 * server-only detail and must never reach the browser bundle. Anything in
 * `clientEnvSchema` is public by definition — Next.js inlines every
 * `NEXT_PUBLIC_*` value into client JavaScript, so nothing sensitive may ever
 * carry that prefix.
 *
 * This file is intentionally pure (no `process.env` access, no `server-only`
 * import) so it can be unit tested. Reading the actual environment happens in
 * `env.ts` (server) and `env.client.ts` (client).
 */

/**
 * `local` (the default) needs nothing else set — media uploads land on local
 * disk, so a fresh checkout works before anyone has real object-storage
 * credentials. `s3` targets any S3-compatible bucket (AWS S3, R2, MinIO,
 * Wasabi, …) and requires the fields the `.superRefine` below enforces.
 * Never faked: a missing credential fails startup instead of the app
 * pretending an S3 integration exists (P04).
 */
const storageProviderSchema = z.enum(['local', 's3']);

/** Which payment adapter runs. `none` is a real, supported configuration and
 * the default: an environment with no provider credentials still boots, and
 * checkout says payment is unavailable rather than offering a button that
 * cannot work (P11 §5). */
const paymentProviderSchema = z.enum(['none', 'hosted_checkout']);

const baseServerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  /** PostgreSQL connection string. Secret. */
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').startsWith('postgres'),

  STORAGE_PROVIDER: storageProviderSchema.default('local'),

  /** S3-compatible bucket. Required only when STORAGE_PROVIDER=s3. */
  STORAGE_BUCKET: z.string().min(1).optional(),
  /** Omit for real AWS S3; set for any other S3-compatible endpoint (R2, MinIO, Wasabi, …). */
  STORAGE_ENDPOINT: z.string().url().optional(),
  STORAGE_REGION: z.string().min(1).optional(),
  /** Secret. */
  STORAGE_ACCESS_KEY_ID: z.string().min(1).optional(),
  /** Secret. */
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1).optional(),

  /** Public delivery base (a CDN domain, ideally). Falls back to a
   * provider-appropriate default when unset — see media/cdn.ts. */
  MEDIA_PUBLIC_BASE_URL: z.string().url().optional(),
  /** Local-provider only: where uploaded files land on disk. Gitignored. */
  MEDIA_LOCAL_STORAGE_DIR: z.string().min(1).default('.local-storage/media'),
  /** Secret. HMAC key the local provider uses to sign upload URLs — its
   * equivalent of the AWS credentials that sign a real presigned URL.
   * Required only when STORAGE_PROVIDER=local. */
  MEDIA_UPLOAD_SIGNING_SECRET: z.string().min(32).optional(),

  /** Secret. Signs and encrypts the Auth.js JWT session cookie (P06). Read
   * automatically by Auth.js under this exact name — never pass it in code.
   * Generate with `openssl rand -base64 32`. */
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  /** Set to "true" only when deployed behind a reverse proxy that Auth.js
   * should trust for the request's host/protocol (production). Read
   * automatically by Auth.js under this exact name. */
  AUTH_TRUST_HOST: z.enum(['true', 'false']).optional(),

  /** P11. Which payment adapter to run; `none` disables payment entirely. */
  PAYMENT_PROVIDER: paymentProviderSchema.default('none'),
  /** Base URL of the provider's API. Required when a provider is enabled.
   * Not a secret, but environment-specific — sandbox and live differ. */
  PAYMENT_API_BASE_URL: z.string().url().optional(),
  /** Secret. Bearer credential for the provider's API. Never logged, never
   * sent to the browser, never stored on a `Payment` row. */
  PAYMENT_API_KEY: z.string().min(1).optional(),
  /** Secret. HMAC key the provider signs its webhooks with. This is the only
   * thing standing between the payment domain and anyone who can POST to the
   * webhook URL, so it is required whenever a provider is enabled — there is
   * no "verification off" mode. Generate with `openssl rand -hex 32`. */
  PAYMENT_WEBHOOK_SECRET: z.string().min(32).optional(),

  /** Script-only (`scripts/create-admin.mts`) — never read by the running
   * app, so a missing value here never breaks a normal boot. Deliberately
   * outside this schema's enforcement: requiring it at all times would mean
   * every environment needs a bootstrap admin password set forever, when
   * it's only needed once, by the person running the script. */
});

export const serverEnvSchema = baseServerEnvSchema.superRefine((value, ctx) => {
  if (value.STORAGE_PROVIDER === 's3') {
    for (const key of [
      'STORAGE_BUCKET',
      'STORAGE_ACCESS_KEY_ID',
      'STORAGE_SECRET_ACCESS_KEY',
    ] as const) {
      if (!value[key]) {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: `${key} is required when STORAGE_PROVIDER=s3`,
        });
      }
    }
  }
  if (value.PAYMENT_PROVIDER !== 'none') {
    // A provider that is switched on without its credentials is worse than
    // one that is off: the store would offer a pay button that fails after
    // the customer commits. Refusing to boot says so at deploy time instead.
    for (const key of [
      'PAYMENT_API_BASE_URL',
      'PAYMENT_API_KEY',
      'PAYMENT_WEBHOOK_SECRET',
    ] as const) {
      if (!value[key]) {
        ctx.addIssue({
          code: 'custom',
          path: [key],
          message: `${key} is required when PAYMENT_PROVIDER is not "none"`,
        });
      }
    }
  }
  if (value.STORAGE_PROVIDER === 'local' && !value.MEDIA_UPLOAD_SIGNING_SECRET) {
    ctx.addIssue({
      code: 'custom',
      path: ['MEDIA_UPLOAD_SIGNING_SECRET'],
      message: 'MEDIA_UPLOAD_SIGNING_SECRET is required when STORAGE_PROVIDER=local (the default)',
    });
  }
});

export const clientEnvSchema = z.object({
  /** Absolute public origin, used for canonical URLs, sitemaps and hreflang. */
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  /** Default storefront locale. Arabic is the default per ADR-023. */
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['ar', 'en']).default('ar'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/** Prefix reserved by Next.js for values that are inlined into client JS. */
const PUBLIC_PREFIX = 'NEXT_PUBLIC_';

/**
 * Guard against the single most damaging environment mistake: giving a secret
 * a `NEXT_PUBLIC_` name, which silently publishes it to every visitor.
 */
export function assertNoPublicSecrets(schemaKeys: readonly string[]): void {
  const leaked = schemaKeys.filter((key) => key.startsWith(PUBLIC_PREFIX));
  if (leaked.length > 0) {
    throw new Error(
      `Server environment variables must not use the ${PUBLIC_PREFIX} prefix, ` +
        `because Next.js inlines those into the browser bundle. Offending keys: ${leaked.join(', ')}`,
    );
  }
}

export type ParseResult<T> = { success: true; data: T } | { success: false; message: string };

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
}

/** Parse and validate the server environment. Never throws raw Zod errors. */
export function parseServerEnv(source: Record<string, string | undefined>): ParseResult<ServerEnv> {
  assertNoPublicSecrets(Object.keys(baseServerEnvSchema.shape));
  const result = serverEnvSchema.safeParse(source);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    message: `Invalid server environment:\n${formatIssues(result.error)}`,
  };
}

/** Parse and validate the client environment. */
export function parseClientEnv(source: Record<string, string | undefined>): ParseResult<ClientEnv> {
  const result = clientEnvSchema.safeParse(source);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    message: `Invalid client environment:\n${formatIssues(result.error)}`,
  };
}
