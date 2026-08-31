/**
 * `inventory` — stock levels and the adjustment history. Sole owner of stock writes.
 *
 * May depend on: core, catalog
 * Must not depend on: orders — orders call inventory, never the reverse
 *
 * Boundary only in P01. Implementation lands in P08.
 * Other modules import `@/modules/inventory`, never a file inside it.
 */

export {};
