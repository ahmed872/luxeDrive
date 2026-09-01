/**
 * `identity` — users, sessions, roles, permissions, audit log.
 *
 * May depend on: core
 * Must not depend on: every domain module — identity is depended on, it does not depend back
 *
 * P06: real Auth.js-backed authentication, a DB-revocable session on top of
 * it, static role→permission RBAC, and the server-side authorization
 * helpers (`requireUser`/`requirePermission`) every admin boundary calls
 * directly — never a UI-only guard.
 *
 * Other modules import `@/modules/identity`, never a file inside it.
 */

export { handlers, auth, signIn, signOut } from './auth';

export {
  requireUser,
  requirePermission,
  getOptionalUser,
  type AuthenticatedUser,
} from './authorize';

export {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  isPermission,
  roleHasPermission,
  isAdminRole,
  type Permission,
} from './permissions';

export { hashPassword, verifyPassword, validatePasswordPolicy, passwordPolicySchema } from './password';

export {
  createUser,
  getUserByEmail,
  getUserById,
  setUserActive,
  setUserRole,
  verifyAdminCredentials,
  type CreateUserInput,
  type VerifyCredentialsResult,
} from './user.service';

export { recordAuditEvent, type AuditAction, type RecordAuditEventInput } from './audit.service';

export { revokeAllUserSessions, revokeDbSession } from './session.service';
