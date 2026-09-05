# Architecture

The decisions behind this structure are recorded in the Final ADR. This
document is the working map: where code goes, what may import what, and how
that is enforced.

## Repository layout

```
.
├── .github/workflows/ci.yml   install → typecheck → lint → test → migrate → build
├── docs/                      environments, backup and recovery, this file
├── generated/prisma/          generated Prisma client (gitignored)
├── legacy/                    the original Vite app — reference only, never built
├── prisma/
│   ├── schema.prisma          the data model
│   └── migrations/            applied migrations, in order
├── scripts/                   backup.sh, db-smoke.mjs
└── src/
    ├── app/                   Next.js App Router (routes and layouts only)
    ├── components/ui/         design system components
    ├── lib/                   presentation helpers (cn)
    └── modules/               the domain — one folder per bounded module
```

`legacy/` is excluded from TypeScript, ESLint, Prettier and the Next build. It
exists so the original UI stays runnable as a visual reference (`cd legacy &&
pnpm install && pnpm dev`) while the platform is rebuilt. It is deleted only
when the migration is complete and you say so.

## Modules

Fifteen modules, each owning one part of the domain. A module's `index.ts` is
its public surface: other modules import `@/modules/<name>` and never a file
inside it.

```
core → identity → media → catalog → search
                            ↓
                        inventory → pricing → cart → orders
                                                       ↓
                                     payments · notifications
 customers · content · settings · analytics
```

| Module          | Owns                                               | May import                                                                  |
| --------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| `core`          | database client, environment, errors, money        | —                                                                           |
| `identity`      | users, sessions, roles, audit log                  | core                                                                        |
| `media`         | assets, uploads, storage providers                 | core                                                                        |
| `catalog`       | products, categories, brands, attributes, variants | core, media                                                                 |
| `search`        | search service and providers                       | core, catalog                                                               |
| `inventory`     | stock levels, adjustment history                   | core, catalog                                                               |
| `pricing`       | price resolution, discounts, coupons               | core, catalog                                                               |
| `cart`          | cart lifecycle                                     | core, catalog, pricing, inventory                                           |
| `customers`     | accounts, addresses, wishlist, reviews             | core, identity, catalog                                                     |
| `payments`      | payment service, providers, webhooks               | core                                                                        |
| `notifications` | channels, templates                                | core, settings                                                              |
| `content`       | homepage sections, banners, navigation             | core, media, catalog                                                        |
| `settings`      | store settings, branding, shipping config          | core, media                                                                 |
| `analytics`     | reporting queries, rollups (read-only)             | core                                                                        |
| `orders`        | order lifecycle, state machine, events             | core, catalog, pricing, inventory, cart, customers, payments, notifications |

Two rules matter more than the rest:

- **`catalog` does not know `orders` exists.** The catalog describes what is
  for sale; it must not learn about selling. Breaking this is how a product
  model ends up with order-shaped fields.
- **`analytics` never writes.** Reporting that mutates is how numbers stop
  matching reality.

### What each module actually holds today

Every module above owns a real, used implementation, with three exceptions
worth naming rather than leaving to be discovered:

- **`analytics` is a boundary and nothing else.** It exports nothing. No
  phase has built reporting, and the module says so in its own `index.ts`
  rather than shipping a function that returns invented numbers.
- **`content` and `settings` are read-only.** The storefront reads homepage
  sections and store settings; nothing writes either through the admin.
  Their values are set by the seed script or directly in the database.
- **`search` is Postgres-backed** behind a provider interface, so a real
  search service can replace it without touching `catalog`.

The four admin sections with no screen (`customers`, `content`, `analytics`,
`settings`) line up with the first two of those: a permission and a nav
entry exist, and the URL renders an honest "being built" page that still
runs the same server-side permission check every real admin route does.

### Enforcement

The graph is not a diagram anyone has to remember — it is the ESLint config,
and CI fails on violation.

| Rule                                       | Prevents                                                   |
| ------------------------------------------ | ---------------------------------------------------------- |
| `boundaries/element-types`                 | any import outside the table above                         |
| `no-restricted-imports` on `@/modules/*/*` | reaching past a module's public surface into its internals |
| `import/no-cycle`                          | circular dependencies                                      |

All three were verified during P01 by writing deliberate violations and
confirming each one fails:

```
catalog importing orders   → boundaries/element-types    ✗ rejected
@/modules/core/db deep     → no-restricted-imports       ✗ rejected
a → b → a                  → import/no-cycle             ✗ rejected
```

Adding a legitimate new dependency means editing `MODULE_DEPENDENCIES` in
`eslint.config.mjs` — a visible, reviewable change rather than an import that
quietly appears in a diff.

## Layers inside a module

```
Route / Server Action     validation (Zod) + permission check
        ↓
Service                   business logic — the only place decisions are made
        ↓
Repository (Prisma)       data access, no decisions
```

Business logic lives in services because the same operation is called from more
than one place: the UI, a payment webhook, a scheduled job, a test. One
implementation, not four.

## Server and client boundary

`src/modules/core/env.ts` and `db.ts` start with `import 'server-only'`. A
client component that imports them — directly or through a chain — fails the
build instead of shipping a secret. Verified in P01: the build exits 1 with
`'server-only' cannot be imported from a Client Component module`.

## Data model conventions

- **Money is always an integer in minor units** (halalas for SAR), named
  `...Minor`. Floats never touch a stored amount.
- **Order items carry snapshots** of product name, SKU and price, so an old
  invoice stays correct after the product changes or is deleted.
- **Price and stock live on the variant**, even for a product with no options,
  so there is one pricing path rather than two.
- **Bilingual content is explicit columns** (`nameAr`, `nameEn`), not a
  translation table — both languages are first class.
