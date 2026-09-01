/**
 * Fixed credentials for the P06 admin e2e fixtures — the single source of
 * truth for both `scripts/seed-e2e-admins.mts` (which creates these
 * accounts) and every `e2e/admin-*.spec.ts` file (which logs in as them).
 * Not real accounts, not shipped in the app — dev/test-only rows in the
 * local database this project's `.env` points at.
 */
export const E2E_OWNER = { email: 'e2e-owner@example.com', password: 'E2eOwnerPass123' };
export const E2E_STAFF = { email: 'e2e-staff@example.com', password: 'E2eStaffPass123' };
export const E2E_DISABLED = { email: 'e2e-disabled@example.com', password: 'E2eDisabledPass123' };
