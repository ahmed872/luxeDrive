/**
 * `pricing` — price resolution, discounts, coupons. The only source of monetary totals.
 *
 * May depend on: core, catalog
 * Must not depend on: cart, orders — they call pricing, never the reverse
 *
 * Boundary only in P01. Implementation lands in P09.
 * Other modules import `@/modules/pricing`, never a file inside it.
 */

export {};
