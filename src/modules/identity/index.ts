/**
 * `identity` — users, sessions, roles, permissions, audit log.
 *
 * May depend on: core
 * Must not depend on: every domain module — identity is depended on, it does not depend back
 *
 * Boundary only in P01. Implementation lands in P06.
 * Other modules import `@/modules/identity`, never a file inside it.
 */

export {};
