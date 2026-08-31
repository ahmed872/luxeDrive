/**
 * `analytics` — reporting queries and rollups. Read-only by rule.
 *
 * May depend on: core
 * Must not depend on: writes of any kind to any module
 *
 * Boundary only in P01. Implementation lands in P12.
 * Other modules import `@/modules/analytics`, never a file inside it.
 */

export {};
