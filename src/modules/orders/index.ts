/**
 * `orders` — order lifecycle, the state machine, and order events.
 *
 * May depend on: core, catalog, pricing, inventory, cart, customers, payments, notifications
 * Must not depend on: nothing above it
 *
 * Boundary only in P01. Implementation lands in P08.
 * Other modules import `@/modules/orders`, never a file inside it.
 */

export {};
