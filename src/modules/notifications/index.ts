/**
 * `notifications` — channels and templates. Delivery is driven by the outbox.
 *
 * May depend on: core, settings
 * Must not depend on: orders, catalog — callers pass data in
 *
 * Boundary only in P01. Implementation lands in P11.
 * Other modules import `@/modules/notifications`, never a file inside it.
 */

export {};
