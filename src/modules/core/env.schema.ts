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

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  /** PostgreSQL connection string. Secret. */
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').startsWith('postgres'),
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
  assertNoPublicSecrets(Object.keys(serverEnvSchema.shape));
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
