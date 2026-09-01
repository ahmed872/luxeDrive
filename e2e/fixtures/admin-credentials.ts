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

/**
 * A second OWNER, for the long acceptance journey.
 *
 * P06's login rate limiter buckets by `ip:email` (10 attempts per 5
 * minutes). Every e2e login in this suite comes from the same loopback
 * address, so a full run's owner logins — the auth spec's deliberate
 * successes and failures, the shared fixture's one per worker, and this
 * journey's own — add up past that budget and the limiter starts refusing,
 * exactly as it should. Splitting the acceptance run onto its own account
 * keeps each bucket honest instead of weakening a real defense to make
 * tests pass.
 */
export const E2E_ACCEPTANCE_OWNER = {
  email: 'e2e-acceptance@example.com',
  password: 'E2eAcceptancePass123',
};
