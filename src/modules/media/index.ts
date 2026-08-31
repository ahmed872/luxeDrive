/**
 * `media` — assets, uploads, storage providers. Generic: products, banners and content all use it.
 *
 * May depend on: core
 * Must not depend on: catalog, content — media is a service they consume
 *
 * Boundary only in P01. Implementation lands in P04.
 * Other modules import `@/modules/media`, never a file inside it.
 */

export {};
