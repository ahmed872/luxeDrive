/**
 * `search` — search service and providers. PostgreSQL first, external engine behind the same interface.
 *
 * May depend on: core, catalog
 * Must not depend on: cart, orders, payments
 *
 * Boundary only in P01. Implementation lands in P05.
 * Other modules import `@/modules/search`, never a file inside it.
 */

export {};
