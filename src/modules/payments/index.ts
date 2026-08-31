/**
 * `payments` — payment service and providers, webhook verification and idempotency.
 *
 * May depend on: core
 * Must not depend on: orders — payments are called by orders through an interface, never the reverse
 *
 * Boundary only in P01. Implementation lands in P11.
 * Other modules import `@/modules/payments`, never a file inside it.
 */

export {};
