// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration Matrix
 * Project  : Volkswagen Automation Suite
 * Author   : Mukul Narayana
 */

module.exports = defineConfig({
  // ── Test Discovery ────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.js',

  // ── Global Settings ───────────────────────────────────────────
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
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
    baseURL: 'https://www.volkswagen.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // ── Browser / Device Configuration Matrix ────────────────────
  projects: [
    // ── Desktop Browsers ────────────────────────────────────────
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

    // ── Mobile Browsers ─────────────────────────────────────────
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },

    // ── Branded Browsers ────────────────────────────────────────
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  // ── Output ───────────────────────────────────────────────────
  outputDir: 'test-results/',
});
