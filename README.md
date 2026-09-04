# LuxeDrive

A production-grade, general-purpose e-commerce platform: the store owner runs
the catalog, offers, orders and storefront content without a developer, and
cars are one kind of product rather than the shape of the system.

> **Status: code-complete, pending production provisioning.** The storefront,
> the customer account, checkout, the payment boundary, the admin panel and
> transactional email are all built and tested. What remains is not code —
> it is a database, a bucket, an SMTP account and a deployment. See
> [docs/environments.md](docs/environments.md#production-configuration-checklist-p14).

## What is built

**Storefront** (`/ar/…`, `/en/…`) — bilingual and RTL-aware throughout, in
light and dark themes: home, category and product pages, search, cart,
checkout, order confirmation and a payment step, plus customer accounts
(register, verify email, sign in, profile, order history, password reset).
A guest can shop and check out without an account; their cart merges into
their account when they create one.

**Admin** (`/admin`) — sign-in with real server-side sessions and
role-based access control, then products and variants, categories, brands,
inventory, pricing, promotions and coupons, orders, and staff/user
administration.

**Not built, deliberately.** Four admin areas — customers, content,
analytics and settings — have a permission, a nav entry and a plainly
labelled "this section is being built" page rather than an empty screen or
a fake one. Each is a whole domain no phase has claimed. See
[docs/architecture.md](docs/architecture.md).

## Stack

|            |                                                          |
| ---------- | -------------------------------------------------------- |
| Framework  | Next.js (App Router), React, SSR + ISR                   |
| Language   | TypeScript, strict                                       |
| Styling    | Tailwind v4 with design tokens, shadcn/ui foundation     |
| Database   | PostgreSQL + Prisma (driver adapter)                     |
| Auth       | Auth.js — two separate instances, admin and storefront   |
| Validation | Zod, shared between server and client                    |
| Tests      | Vitest (unit + integration), Playwright (e2e, axe)       |
| Hosting    | Vercel + managed PostgreSQL + S3-compatible object store |

## Getting started

Requires Node 20.11+, pnpm 10, and a local PostgreSQL 16.

```bash
pnpm install                 # generates the Prisma client via postinstall
cp .env.example .env         # then set DATABASE_URL and the secrets it names

pnpm db:migrate              # apply migrations
pnpm db:smoke                # prove the connection and typed client work
pnpm dev                     # http://localhost:3000
```

Then create the first admin account and, optionally, load the demo catalog:

```bash
BOOTSTRAP_ADMIN_EMAIL="you@example.com" \
BOOTSTRAP_ADMIN_PASSWORD="a real password, 12+ chars" pnpm db:create-admin

pnpm db:migrate-cars          # legacy/src/data/cars.json → the catalog
pnpm db:seed-storefront-demo  # publish it, add Arabic copy, seed the homepage
```

Full environment setup — including the test database, the extra variables
both test suites need, and the production variables — is in
[docs/environments.md](docs/environments.md).

## Commands

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | development server                               |
| `pnpm build`      | production build                                 |
| `pnpm verify`     | typecheck → lint → test → build (what CI runs)   |
| `pnpm typecheck`  | TypeScript, no emit                              |
| `pnpm lint`       | ESLint, including module boundary rules          |
| `pnpm format`     | Prettier                                         |
| `pnpm test`       | unit and integration tests (needs the test DB)   |
| `pnpm test:e2e`   | Playwright — journeys, axe, visual regression    |
| `pnpm db:migrate` | create and apply a migration (development)       |
| `pnpm db:deploy`  | apply existing migrations (test, production)     |
| `pnpm db:smoke`   | verify the database connection end to end        |
| `pnpm db:backup`  | logical backup — see docs/backup-and-recovery.md |

`pnpm test` and `pnpm test:e2e` both need a few variables beyond
`.env.example`'s production-shaped defaults, and the e2e suite needs the
demo catalog seeded — see
[docs/environments.md](docs/environments.md#running-the-test-suites-p14).

## Documentation

- [Architecture](docs/architecture.md) — repository layout, the fifteen
  modules, how the dependency rules are enforced.
- [Environments and secrets](docs/environments.md) — development, test and
  production separation, why no secret can reach the browser, what a real
  production deploy has to provision, and what changes once the application
  runs as more than one instance.
- [Backup and recovery](docs/backup-and-recovery.md) — what is backed up, how
  to restore, and the restore drill.

## Security posture, in one paragraph

Every admin and account boundary is checked on the server, in the Server
Action or Server Component itself — a hidden button is never treated as
authorization, and the test suite calls those boundaries directly rather
than through the UI to prove it. Sessions are JWT-transported but
database-backed, so a role change, a disable, or a revocation takes effect
on the account's next request rather than at token expiry. Money, stock and
order totals are derived server-side from data the client cannot name;
checkout accepts no price, no total and no cart id. Payment outcomes move
only on an HMAC-verified webhook. Server-only environment access is enforced
by the build, and CI greps the client bundle for the database password on
every push.

## The legacy application

The original Vite single-page app lives in [`legacy/`](legacy/), untouched.
It is excluded from every build, lint and test, and is kept as a visual and
behavioural reference:

```bash
cd legacy && pnpm install && pnpm dev
```

Its `cars.json` is still the source the demo catalog is migrated from
(`pnpm db:migrate-cars`), which is why it is still here. The pre-rebuild
state is also tagged `pre-rebuild-reference`.

## Admin access

There is no default admin account, and no credential anywhere in source
control, seed data or the UI. The first account is created once, by hand,
with `pnpm db:create-admin`, from environment variables the running
application never reads. (The original build hardcoded credentials in
client-side JavaScript and printed them on the login page; they were removed
in P00 and have not come back.) After that, an owner adds and manages the
rest of the team at `/admin/users`.
