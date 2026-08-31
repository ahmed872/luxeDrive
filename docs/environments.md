# Environments and secrets

Three environments, one contract. Every variable is validated at startup by
`src/modules/core/env.schema.ts`, so a missing or malformed value fails
immediately and loudly instead of surfacing later as a confusing runtime error.

## The separation

|            | development                                 | test                                                       | production                                    |
| ---------- | ------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| Database   | local PostgreSQL, `luxedrive_dev`           | local/CI PostgreSQL, `luxedrive_test` (CI: `luxedrive_ci`) | managed PostgreSQL                            |
| Env source | `.env` (gitignored)                         | `.env.test` (gitignored) / CI job env                      | Vercel project environment variables          |
| Data       | disposable seed data                        | wiped and recreated by the test run                        | real customer data — never copied to a laptop |
| Migrations | `pnpm db:migrate` (creates migration files) | `pnpm db:deploy`                                           | `pnpm db:deploy` in the deploy pipeline only  |

The three never share a database. A destructive migration tried on
`luxedrive_dev` costs nothing; the same command against production is an
incident.

## The two rules that keep secrets out of the browser

**1. `NEXT_PUBLIC_` means public forever.** Next.js inlines any variable with
that prefix into client JavaScript at build time. It is not a visibility
setting that can be revoked later — once built and deployed, the value is in
every visitor's browser. `assertNoPublicSecrets()` throws at boot if a server
variable is ever given that prefix.

**2. Server env is unreachable from client code.** `src/modules/core/env.ts`
begins with `import 'server-only'`. If any client component imports it, even
transitively, **the build fails** rather than shipping the secret. This is
verified, not assumed — see the verification below.

### Verifying it

Two checks run in CI on every push:

- The build output is grepped for the database password and for any
  `postgresql://` string. Either one found in `.next/static` fails the job.
- A client component importing `serverEnv()` was tested during P01 and the
  build failed with `'server-only' cannot be imported from a Client Component
module`, exit code 1.

To repeat the second check by hand:

```bash
mkdir -p src/app/leak-test
cat > src/app/leak-test/page.tsx <<'EOF'
'use client';
import { serverEnv } from '@/modules/core/env';
export default function Leak() { return <p>{serverEnv().DATABASE_URL}</p>; }
EOF
pnpm build   # must fail
rm -rf src/app/leak-test
```

Note the directory name: Next.js ignores folders whose name starts with `_`, so
a test route called `__leak-test` is silently excluded and the check would
appear to pass while proving nothing.

## Which values are secret

| Variable                                             | Secret | Used from        | Phase |
| ---------------------------------------------------- | ------ | ---------------- | ----- |
| `DATABASE_URL`                                       | yes    | server only      | now   |
| `NEXT_PUBLIC_SITE_URL`                               | no     | browser + server | now   |
| `NEXT_PUBLIC_DEFAULT_LOCALE`                         | no     | browser + server | now   |
| `AUTH_SECRET`                                        | yes    | server only      | P06   |
| `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY` | yes    | server only      | P04   |
| `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET`          | yes    | server only      | P11   |
| `EMAIL_API_KEY`                                      | yes    | server only      | P11   |

The later ones are documented in `.env.example` but not in the schema yet:
requiring a variable no code reads would fail every build for nothing.

## Local setup

```bash
# 1. PostgreSQL 16 running locally, then:
createuser luxedrive --createdb --pwprompt
createdb luxedrive_dev -O luxedrive
createdb luxedrive_test -O luxedrive

# 2. Environment
cp .env.example .env          # set DATABASE_URL to match the user you created
cp .env .env.test             # point it at luxedrive_test

# 3. Schema and client
pnpm install                  # runs `prisma generate` via postinstall
pnpm db:migrate               # applies migrations to luxedrive_dev
pnpm db:smoke                 # proves the connection and the typed client work
```

## Production (Vercel)

Set the variables in the Vercel project, per environment (Production, Preview,
Development). Nothing is read from a committed file.

- `DATABASE_URL` — the managed database's **pooled** connection string for the
  application.
- Migrations must not run through a connection pooler. The deploy step sets
  `DATABASE_URL` to the provider's **direct** connection string for the
  duration of `pnpm db:deploy`. Prisma 7 removed `directUrl` from the schema,
  so this is handled by the pipeline rather than by configuration.

Preview deployments must point at a database that is not production. A preview
branch running migrations against live data is the same incident as running
them by hand.
