/**
 * `analytics` — reporting queries and rollups. Read-only by rule.
 *
 * May depend on: core
 * Must not depend on: writes of any kind to any module
 *
 * Boundary only, still, as of P14. No phase through P14 has built
 * reporting: `/admin/analytics` renders the shared "coming soon"
 * placeholder (permission-checked like every other admin route), and this
 * module deliberately exports nothing rather than a plausible-looking
 * function that returns invented numbers. An earlier note here said the
 * implementation would land in P12; P12 built customer identity instead,
 * and nothing since has claimed this.
 *
 * Other modules import `@/modules/analytics`, never a file inside it.
 */

export {};
