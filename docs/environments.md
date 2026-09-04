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

| Variable                                                             | Secret | Used from                  | Phase   |
| -------------------------------------------------------------------- | ------ | -------------------------- | ------- |
| `DATABASE_URL`                                                       | yes    | server only                | now     |
| `NEXT_PUBLIC_SITE_URL`                                               | no     | browser + server           | now     |
| `NEXT_PUBLIC_DEFAULT_LOCALE`                                         | no     | browser + server           | now     |
| `STORAGE_PROVIDER`                                                   | no     | server only                | P04     |
| `MEDIA_UPLOAD_SIGNING_SECRET` (local provider)                       | yes    | server only                | P04     |
| `MEDIA_LOCAL_STORAGE_DIR` (local provider)                           | no     | server only                | P04     |
| `STORAGE_BUCKET`, `STORAGE_ENDPOINT`, `STORAGE_REGION` (s3 provider) | no     | server only                | P04     |
| `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY` (s3 provider)   | yes    | server only                | P04     |
| `MEDIA_PUBLIC_BASE_URL`                                              | no     | server only                | P04     |
| `AUTH_SECRET`                                                        | yes    | server only                | P06     |
| `AUTH_TRUST_HOST`                                                    | no     | server only                | P06/P14 |
| `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` (script-only)    | yes    | `create-admin` script only | P06     |
| `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET`                          | yes    | server only                | P11     |
| `EMAIL_PROVIDER`                                                     | no     | server only                | P13     |
| `EMAIL_DISPATCH_SECRET`                                              | yes    | server only                | P13     |
| `EMAIL_FROM`, `EMAIL_FROM_NAME`                                      | no     | server only                | P13     |
| `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER` (smtp)       | no     | server only                | P13     |
| `EMAIL_SMTP_PASSWORD` (smtp)                                         | yes    | server only                | P13     |
| `EMAIL_TEST_INBOX_DIR` (test provider)                               | no     | server only (`.env.test`)  | P13     |

### Media storage (P04)

`STORAGE_PROVIDER` picks the backend behind the one `StorageProvider`
interface in `src/modules/media` — `local` (the default) needs nothing but
`MEDIA_UPLOAD_SIGNING_SECRET`; `s3` targets any S3-compatible bucket (AWS S3,
Cloudflare R2, MinIO, Wasabi, …) and requires the four `STORAGE_*` values.
Neither is faked when unset — `s3` without its credentials fails startup
rather than silently pretending an integration exists. See
`.env.example` for the exact contract and `MediaAsset.provider` for which
backend actually holds a given asset's bytes today.

### Authentication (P06)

`AUTH_SECRET` signs and encrypts the Auth.js session JWT — Auth.js reads it
automatically under this exact name, nothing in the codebase passes it
explicitly. Rotating it is a real, intentional action: every existing admin
session becomes unverifiable the moment the value changes (the JWT
signature no longer matches), which is the correct way to force a full
logout of every admin session at once if one is ever suspected compromised.

`AUTH_TRUST_HOST` is unset (and unnecessary) for local development; **it is
required whenever `NODE_ENV=production`** (P14), enforced at boot the same
way every other production-only requirement in this schema is. This was
discovered, not assumed: running a real `next build && next start` locally
(rather than only the dev server) showed every sign-in — customer and admin
alike — failing behind Auth.js's own generic "There was a problem with the
server configuration" page, with nothing in the application's logs pointing
at the cause, because Auth.js's `trustHost` defaults to `false` outside
development and this project's deployment target (Vercel) always sits in
front of the running app the way a reverse proxy does. Set to `"true"`,
Auth.js trusts the forwarded host/protocol headers instead of rejecting the
request. The one exception is the build step itself (`next build` also sets
`NODE_ENV=production` to compile, without ever serving a request) — the
schema recognizes that phase via Next.js's own `NEXT_PHASE` variable and
does not require `AUTH_TRUST_HOST` for it, so CI's `pnpm build` step needs
no change.

`BOOTSTRAP_ADMIN_EMAIL`/`BOOTSTRAP_ADMIN_PASSWORD` are read only by
`pnpm db:create-admin` (`scripts/create-admin.mts`) — never by the running
app, never written to the database or logged anywhere. The script refuses
to run without both set; there is no default admin account and no
credential anywhere in source control, seed data, or the UI (the legacy
`admin`/`admin123` account was removed in P00 and never comes back).

### Email delivery (P13)

`EMAIL_PROVIDER` picks the backend behind the one `EmailProviderAdapter`
interface in `src/modules/notifications` — `console` (the default) needs
nothing at all and is a real, honest "not configured yet" stance identical
to `PAYMENT_PROVIDER="none"`: the outbox still gets drained and every event
still gets marked delivered, but "delivery" is a sanitized log line, not a
reached inbox. `smtp` is the real adapter (any SMTP-speaking transactional
service, or a self-hosted relay) and requires `EMAIL_SMTP_HOST`/
`EMAIL_SMTP_PORT`/`EMAIL_FROM` at minimum. `test` is the deterministic
adapter the test suite drives directly — set only in `.env.test`.

`EMAIL_DISPATCH_SECRET` is required unconditionally, the same way
`AUTH_SECRET` is: `POST /api/internal/email-dispatch` is real
spam-sending infrastructure the moment it exists, regardless of which
adapter is configured behind it, so the endpoint refuses every request
without a matching `Authorization: Bearer` value. A scheduler (Vercel Cron,
any external cron hitting the URL) is expected to call it periodically;
see `vercel.json` for the schedule this deployment uses.

`EMAIL_TEST_INBOX_DIR` is read only by the `test` adapter, and only exists
so a Playwright spec — a separate OS process from the running dev server —
can read what the app just attempted to send and pull a verification/reset
link out of it. Nothing under `console` or `smtp` ever writes there.

## Local setup

```bash
# 1. PostgreSQL 16 running locally, then:
createuser luxedrive --createdb --pwprompt
createdb luxedrive_dev -O luxedrive
createdb luxedrive_test -O luxedrive

# 2. Environment
cp .env.example .env          # set DATABASE_URL to match the user you created
cp .env .env.test             # point it at luxedrive_test
# .env.example already sets STORAGE_PROVIDER=local; replace
# MEDIA_UPLOAD_SIGNING_SECRET's and AUTH_SECRET's placeholders with real
# random values (`openssl rand -base64 32`) in both files.

# 3. Schema and client
pnpm install                  # runs `prisma generate` via postinstall
pnpm db:migrate               # applies migrations to luxedrive_dev
pnpm db:smoke                 # proves the connection and the typed client work

# 4. First admin account (P06) — one-off, values never committed:
BOOTSTRAP_ADMIN_EMAIL="owner@example.com" BOOTSTRAP_ADMIN_PASSWORD="a real password, 12+ chars" pnpm db:create-admin
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

- `EMAIL_PROVIDER`/`EMAIL_DISPATCH_SECRET`/`EMAIL_FROM`/`EMAIL_SMTP_*` — set
  per environment like every other secret above. A Preview deployment left
  on `EMAIL_PROVIDER="console"` is a legitimate, honest choice (verification
  and reset links are logged, not delivered) rather than a broken one; only
  Production needs `smtp` actually configured.
- `vercel.json`'s `crons` entry calls `GET /api/internal/email-dispatch`
  once daily; Vercel Cron sends `Authorization: Bearer $CRON_SECRET`
  automatically for routes defined there, so the Vercel project's
  `CRON_SECRET` variable must be set to the _same_ value as
  `EMAIL_DISPATCH_SECRET` — there is no separate mechanism, just one shared
  secret the route checks the same way regardless of who is calling.

  **The once-daily cadence is deliberate, not a placeholder (P14).** Vercel's
  own documented plan limits (verified directly, not assumed) cap the
  **Hobby (free) plan at once-per-day minimum cron frequency** — a more
  frequent schedule is rejected at deploy time on that plan. Only the Pro
  plan and above support per-minute cron. Once-daily dispatch alone is too
  slow to be useful: it would leave most password-reset links (a 1-hour
  token TTL) expiring before a customer ever receives them.

  **The free-tier answer (this project's actual setup):**
  `.github/workflows/email-dispatch-cron.yml` calls the same endpoint every
  5 minutes from GitHub Actions instead. This repository is public, so
  GitHub Actions minutes for it are unlimited and free regardless of
  schedule frequency — unlike a private repository, where a 5-minute
  schedule would burn through the free minutes allowance quickly.
  `vercel.json`'s own once-daily cron entry stays in place as a slow safety
  net (so the outbox still drains once a day even if the GitHub Actions
  workflow or its secrets are ever misconfigured); calling the endpoint from
  both places is harmless since dispatch is idempotent-to-call.

  Setting this up requires two values configured once in this repository's
  own GitHub settings (Settings → Secrets and variables → Actions) — see
  the workflow file's own header comment for the exact names. Neither is
  committed anywhere; the workflow skips itself (rather than failing) until
  both are set.

  **Upgrading to Vercel Pro later** removes the need for the GitHub Actions
  workaround: change `vercel.json`'s schedule back to `*/5 * * * *` (or
  tighter) and either remove the GitHub Actions workflow or leave it running
  alongside it — both are safe.

## Production configuration checklist (P14)

Every value below is validated at boot by `src/modules/core/env.schema.ts` —
this list only says which are _required_ for a real production deploy versus
which have a safe, free, "not configured yet" default. No secret's actual
value is ever written in this file, in the repository, or in any report
generated about this project.

**Core — required in every environment:**

- `DATABASE_URL` — production's managed Postgres connection string.
- `AUTH_SECRET` — signs/encrypts the admin session JWT (Auth.js).
- `AUTH_TRUST_HOST="true"` — required the moment `NODE_ENV=production` (P14);
  every sign-in fails without it. See "Authentication (P06)" above for why.
- `NEXT_PUBLIC_SITE_URL` — the exact production origin; every email link and
  canonical URL is built from this value, never a request's `Host` header.
- `STORAGE_PROVIDER` + its pair (`MEDIA_UPLOAD_SIGNING_SECRET` for `local`,
  or the four `STORAGE_*` values for `s3`) — `local` is a real, free,
  fully-functional choice; nothing about going to production requires
  object storage specifically.

**Customer authentication** shares `AUTH_SECRET`'s session-signing
infrastructure and `DATABASE_URL`; it has no configuration of its own beyond
those two.

**Email:**

- `EMAIL_PROVIDER` — `console` is a real, free, honest "not sending yet"
  choice (see below); `smtp` requires the rest of this block.
- `EMAIL_DISPATCH_SECRET` — required unconditionally, regardless of which
  provider is selected (protects the dispatch endpoint itself).
- `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_FROM` — required only when
  `EMAIL_PROVIDER=smtp`.
- `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASSWORD` — required together, or omit both
  for an unauthenticated relay.
- `EMAIL_FROM_NAME` — optional, cosmetic.

**Payments (P11):**

- `PAYMENT_PROVIDER` — `none` is a real, free, fully-supported production
  configuration: checkout says payment is unavailable instead of offering a
  button that cannot work. Required (`PAYMENT_API_BASE_URL`,
  `PAYMENT_API_KEY`, `PAYMENT_WEBHOOK_SECRET`) only once a provider is
  actually enabled.

### Staying on free infrastructure until this project has a paying client

Every default in this project is chosen so a real production deploy costs
nothing until a real vendor is actually needed:

- `STORAGE_PROVIDER=local`, `PAYMENT_PROVIDER=none`, and `EMAIL_PROVIDER=console`
  are each a genuine, working production configuration, not a stub — the
  application boots and functions completely with none of them costing
  money. Verification/reset links are logged rather than emailed, payment is
  visibly unavailable rather than broken, and uploaded media lives on
  Vercel's own filesystem rather than an object-storage bucket.
- Vercel itself has a permanent free (Hobby) tier suitable for this project
  at its current stage; nothing in this codebase requires a paid Vercel plan.
- A managed Postgres database is the one piece every configuration still
  needs — several providers (e.g. Neon, Supabase) have a free tier
  sufficient for early-stage traffic; which one to use is a deployment
  decision, not something this codebase assumes.
- The moment `EMAIL_PROVIDER=smtp` is genuinely wanted (real verification/
  reset emails reaching real inboxes), an SMTP-speaking transactional
  service is needed — most (Postmark, SES, Mailgun's free tier, …) have a
  free tier generous enough for early volume; this project's adapter works
  against any of them unmodified, since it speaks SMTP itself rather than a
  specific vendor's API.
- `EMAIL_PROVIDER=smtp` without real credentials is refused at boot
  (`superRefine` in `env.schema.ts`) rather than silently pretending to
  work — so there is no way to accidentally deploy a broken email
  configuration; the failure is loud and immediate.
