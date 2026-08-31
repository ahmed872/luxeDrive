/**
 * `catalog` — products, categories, brands, attribute definitions, variants.
 *
 * May depend on: core, media
 * Must not depend on: cart, orders, pricing, payments — the catalog knows nothing about selling
 *
 * Boundary only in P01. Implementation lands in P03.
 * Other modules import `@/modules/catalog`, never a file inside it.
 */

export {};
