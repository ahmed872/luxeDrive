/**
 * `customers` — customer accounts, addresses, wishlist, reviews.
 *
 * May depend on: core, identity, catalog
 * Must not depend on: orders, payments
 *
 * Boundary only in P01. Implementation lands in P10.
 * Other modules import `@/modules/customers`, never a file inside it.
 */

export {};
