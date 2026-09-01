import { existsSync } from 'node:fs';

import { defineConfig, devices } from '@playwright/test';

/**
 * Accessibility (axe) and visual-regression checks against the design
 * system (P02). Both target `/dev/gallery` — the one page that renders every
 * token and component — rather than the storefront, which doesn't exist yet.
 *
 * Deliberately not multi-browser: this phase is about the design system
 * being correct, not cross-browser rendering, and running every check three
 * times over would triple CI time for no signal yet.
 */

// Some sandboxes ship a pre-installed Chromium at a fixed path instead of the
// exact revision this Playwright version would otherwise fetch on demand.
// Using it there avoids a network download; everywhere else (GitHub Actions
// included, after its own `playwright install`) this is absent and Playwright
// resolves its normally-installed browser instead.
const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium';
const executablePath = existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined;

/**
 * Chromium reaches out to Google endpoints on its own — variations/finch,
 * autofill, component updates, safe-browsing — none of which any test needs.
 * Behind an egress proxy that holds such connections open instead of
 * refusing them, those requests never settle, the page's `load` event never
 * fires, and every navigation stalls until the test times out: a browser
 * problem that reads exactly like a slow application. Turning the
 * background traffic off removes the whole class of failure.
 */
const CHROMIUM_ARGS = [
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-domain-reliability',
  '--disable-sync',
  '--no-default-browser-check',
  '--no-first-run',
];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['line']] : [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: CHROMIUM_ARGS, ...(executablePath ? { executablePath } : {}) },
      },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
