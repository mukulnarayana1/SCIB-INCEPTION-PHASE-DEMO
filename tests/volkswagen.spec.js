const { test, expect } = require('@playwright/test');

/**
 * ─────────────────────────────────────────────────────────────
 *  Volkswagen UK — Playwright Automation Suite
 *  Base URL : https://www.volkswagen.co.uk
 * ─────────────────────────────────────────────────────────────
 */

// ── Helper: Dismiss cookie consent banner if present ─────────
async function acceptCookies(page) {
  try {
    const btn = page.getByRole('button', {
      name: /accept all|accept all cookies|agree|allow all|i accept/i,
    });
    if (await btn.isVisible({ timeout: 6000 })) {
      await btn.click();
      await page.waitForTimeout(600);
    }
  } catch {
    // No cookie banner — continue
  }
}

// ─────────────────────────────────────────────────────────────
//  GROUP 1 — Homepage
// ─────────────────────────────────────────────────────────────
test.describe('VW UK | Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en.html', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
  });

  test('VW-001 | Page title contains Volkswagen', async ({ page }) => {
    await expect(page).toHaveTitle(/Volkswagen/i);
  });

  test('VW-002 | Page URL resolves to volkswagen.co.uk', async ({ page }) => {
    await expect(page).toHaveURL(/volkswagen\.co\.uk/);
  });

  test('VW-003 | Main navigation is visible', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expect(nav).toBeVisible();
  });

  test('VW-004 | Header is present on the page', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('VW-005 | Footer is present on the page', async ({ page }) => {
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
//  GROUP 2 — Models Page
// ─────────────────────────────────────────────────────────────
test.describe('VW UK | Models Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/models.html', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
  });

  test('VW-006 | Models page URL is correct', async ({ page }) => {
    await expect(page).toHaveURL(/models/);
  });

  test('VW-007 | Models page title contains Volkswagen', async ({ page }) => {
    await expect(page).toHaveTitle(/Volkswagen/i);
  });

  test('VW-008 | At least one heading is visible on Models page', async ({ page }) => {
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
//  GROUP 3 — Navigation Links
// ─────────────────────────────────────────────────────────────
test.describe('VW UK | Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en.html', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
  });

  test('VW-009 | A Models link exists in navigation', async ({ page }) => {
    const modelsLink = page.getByRole('link', { name: /models/i }).first();
    await expect(modelsLink).toBeVisible();
  });

  test('VW-010 | Clicking Models link navigates to models page', async ({ page }) => {
    const modelsLink = page.getByRole('link', { name: /models/i }).first();
    await modelsLink.click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/models/);
  });
});

// ─────────────────────────────────────────────────────────────
//  GROUP 4 — Accessibility
// ─────────────────────────────────────────────────────────────
test.describe('VW UK | Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en.html', { waitUntil: 'domcontentloaded' });
    await acceptCookies(page);
  });

  test('VW-011 | HTML lang attribute is set', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
  });

  test('VW-012 | Page contains a main landmark', async ({ page }) => {
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });

  test('VW-013 | First 10 images have alt attributes', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    const checkCount = Math.min(count, 10);
    let missing = 0;
    for (let i = 0; i < checkCount; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      if (alt === null) missing++;
    }
    expect(missing).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
//  GROUP 5 — Find a Retailer
// ─────────────────────────────────────────────────────────────
test.describe('VW UK | Find a Retailer', () => {
  test('VW-014 | Retailer finder page loads', async ({ page }) => {
    await page.goto('/en/why-vw/find-a-retailer.html', {
      waitUntil: 'domcontentloaded',
    });
    await acceptCookies(page);
    await expect(page).toHaveURL(/volkswagen\.co\.uk/);
  });
});
