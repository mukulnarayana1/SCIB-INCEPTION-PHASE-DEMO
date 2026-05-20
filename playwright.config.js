// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration
 * Project  : Volkswagen UK Automation Suite
 * Base URL : https://www.volkswagen.co.uk
 */

module.exports = defineConfig({
  // ── Test Discovery ────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.js',

  // ── Global Settings ───────────────────────────────────────────
  timeout: 90_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,

  // ── Reporters ─────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ...(process.env.CI ? [['github']] : []),
  ],

  // ── Shared Browser Context ────────────────────────────────────
  use: {
    baseURL: 'https://www.volkswagen.co.uk',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 20_000,
    navigationTimeout: 60_000,
    extraHTTPHeaders: {
      'Accept-Language': 'en-GB,en;q=0.9',
    },
  },

  // ── Browser / Device Configuration Matrix ────────────────────
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // ── Output ───────────────────────────────────────────────────
  outputDir: 'test-results/',
});
