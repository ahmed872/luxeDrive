import { execSync } from 'node:child_process';

import { expect, test } from './fixtures/authenticated';

/**
 * P06 §17/§8: a Client Component `if (!isAdmin) redirect()` is explicitly
 * insufficient — this proves the server boundary itself blocks a direct,
 * cookie-less request, and separately that a signed-in role without a
 * section's permission cannot reach it either, purely by typing the URL
 * (the sidebar never even offers that link to STAFF — `nav-config.test.ts`
 * already proves that; this proves the server enforces it independent of
 * what the UI shows). Authenticated cases use the shared `ownerContext`/
 * `staffContext` fixtures (one real login each, reused) rather than
 * resubmitting the login form per test — see `fixtures/authenticated.ts`.
 */

test.beforeAll(() => {
  execSync('pnpm db:seed-e2e-admins', { cwd: process.cwd(), stdio: 'inherit' });
});

test.describe('unauthenticated direct access', () => {
  test('/admin redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('**/admin/login');
  });

  test('/admin/settings (a specific protected section) redirects to /admin/login', async ({
    page,
  }) => {
    await page.goto('/admin/settings');
    await page.waitForURL('**/admin/login');
  });

  test('/admin/users redirects to /admin/login', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForURL('**/admin/login');
  });
});

test.describe('authenticated but unauthorized direct access (permission-aware, server-enforced)', () => {
  test('STAFF signed in, typing /admin/settings directly, never sees the settings placeholder content', async ({
    staffContext,
  }) => {
    const page = await staffContext.newPage();
    await page.goto('/admin');

    // Confirm STAFF's own dashboard renders (a permission it does have is
    // linked) but never links to Settings (one it doesn't) — the sidebar
    // itself is already permission-filtered, before the direct-URL check
    // below even runs.
    await expect(page.getByRole('link', { name: /Products|المنتجات/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Settings|الإعدادات/ })).toHaveCount(0);

    const response = await page.goto('/admin/settings');
    // Whatever status Next's default error handling assigns a thrown
    // FORBIDDEN, the protected content itself must never have rendered.
    expect(response?.ok()).toBeFalsy();
    await expect(page.getByText(/This section is being built|هذا القسم قيد الإنشاء/)).toHaveCount(
      0,
    );
  });

  test('STAFF signed in, typing /admin/users directly (Super-Admin-only), never sees it either', async ({
    staffContext,
  }) => {
    const page = await staffContext.newPage();
    const response = await page.goto('/admin/users');
    expect(response?.ok()).toBeFalsy();
    await expect(page.getByText(/This section is being built|هذا القسم قيد الإنشاء/)).toHaveCount(
      0,
    );
  });

  test('STAFF *can* reach a section their role does hold permission for (Products)', async ({
    staffContext,
  }) => {
    const page = await staffContext.newPage();
    await page.goto('/admin/products');
    await expect(page.getByText(/This section is being built|هذا القسم قيد الإنشاء/)).toBeVisible();
  });

  test('OWNER can reach every section, including Users', async ({ ownerContext }) => {
    const page = await ownerContext.newPage();
    await page.goto('/admin/users');
    await expect(page.getByText(/This section is being built|هذا القسم قيد الإنشاء/)).toBeVisible();
  });
});
