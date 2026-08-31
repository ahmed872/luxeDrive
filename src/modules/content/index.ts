/**
 * `content` — homepage sections, banners, navigation. A typed section registry, not a page builder.
 *
 * May depend on: core, media, catalog
 * Must not depend on: orders, cart, payments
 *
 * Boundary only in P01. Implementation lands in P12.
 * Other modules import `@/modules/content`, never a file inside it.
 */

export {};
