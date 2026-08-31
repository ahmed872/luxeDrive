# LuxeDrive

A production-grade, general-purpose e-commerce platform: the store owner runs
the catalog, offers, orders and storefront content without a developer, and
cars are one kind of product rather than the shape of the system.

> **Status: Phase 01 — foundation.** There is no storefront and no admin panel
> yet. This phase establishes the framework, database, module boundaries,
> environment separation and CI gates that everything else is built on.

## Stack

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| Framework  | Next.js (App Router), React, SSR + ISR               |
| Language   | TypeScript, strict                                   |
| Styling    | Tailwind v4 with design tokens, shadcn/ui foundation |
| Database   | PostgreSQL + Prisma (driver adapter)                 |
| Validation | Zod, shared between server and client                |
| Tests      | Vitest (unit) — Playwright joins in P05              |
| Hosting    | Vercel + managed PostgreSQL                          |

## Getting started

Requires Node 20.11+, pnpm 10, and a local PostgreSQL 16.

```bash
pnpm install                 # generates the Prisma client via postinstall
cp .env.example .env         # then set DATABASE_URL

pnpm db:migrate              # apply migrations
pnpm db:smoke                # prove the connection and typed client work
pnpm dev                     # http://localhost:3000
```

Full environment setup, including the test database and the production
variables, is in [docs/environments.md](docs/environments.md).

## Commands

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | development server                               |
| `pnpm build`      | production build                                 |
| `pnpm verify`     | typecheck → lint → test → build (what CI runs)   |
| `pnpm typecheck`  | TypeScript, no emit                              |
| `pnpm lint`       | ESLint, including module boundary rules          |
| `pnpm test`       | unit tests                                       |
| `pnpm db:migrate` | create and apply a migration (development)       |
| `pnpm db:deploy`  | apply existing migrations (test, production)     |
| `pnpm db:smoke`   | verify the database connection end to end        |
| `pnpm db:backup`  | logical backup — see docs/backup-and-recovery.md |

## Documentation

- [Architecture](docs/architecture.md) — repository layout, the fifteen
  modules, how the dependency rules are enforced.
- [Environments and secrets](docs/environments.md) — development, test and
  production separation, and why no secret can reach the browser.
- [Backup and recovery](docs/backup-and-recovery.md) — what is backed up, how
  to restore, and the restore drill.

## The legacy application

The original Vite single-page app lives in [`legacy/`](legacy/), untouched. It
is excluded from every build, lint and test, and is kept as a visual and
behavioural reference while the platform is rebuilt:

```bash
cd legacy && pnpm install && pnpm dev
```

It is removed only when the migration is complete. The pre-rebuild state is
also tagged `pre-rebuild-reference`.

## Admin access

Admin sign-in is disabled. The previous build hardcoded credentials in
client-side JavaScript and printed them on the login page, so any visitor could
open the admin panel; they were removed in P00. Real authentication —
server-side sessions with roles — arrives in P06.
