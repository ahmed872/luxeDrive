/**
 * `cart` — cart lifecycle for guests and signed-in customers.
 *
 * May depend on: core, catalog, pricing, inventory
 * Must not depend on: orders, payments
 *
 * Boundary only in P01. Implementation lands in P08.
 * Other modules import `@/modules/cart`, never a file inside it.
 */

export {};
