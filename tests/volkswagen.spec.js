const { test, expect } = require('@playwright/test');

// ─────────────────────────────────────────────
//  Volkswagen Automated Test Suite
//  Framework : Playwright
//  Author    : Mukul Narayana
// ─────────────────────────────────────────────

const BASE_URL = 'https://www.volkswagen.com';

test.describe('Volkswagen - Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('VW-001 | Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Volkswagen/i);
    await expect(page.locator('header')).toBeVisible();
  });

  test('VW-002 | Navigation menu is visible', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('VW-003 | Hero banner is displayed', async ({ page }) => {
    const hero = page.locator('[data-testid="hero-banner"], .hero, .banner').first();
    await expect(hero).toBeVisible();
  });
});

test.describe('Volkswagen - Models Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/models`);
  });

  test('VW-004 | Models page loads correctly', async ({ page }) => {
    await expect(page).toHaveURL(/models/i);
  });

  test('VW-005 | At least one car model card is displayed', async ({ page }) => {
    const modelCards = page.locator('.model-card, [data-testid="model-card"], .car-tile');
    await expect(modelCards.first()).toBeVisible();
  });

  test('VW-006 | Clicking a model navigates to its detail page', async ({ page }) => {
    const firstModel = page.locator('.model-card, [data-testid="model-card"], .car-tile').first();
    await firstModel.click();
    await expect(page).not.toHaveURL(`${BASE_URL}/models`);
  });
});

test.describe('Volkswagen - Search Functionality', () => {
  test('VW-007 | Search icon is present on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    const searchIcon = page.locator('[data-testid="search"], .search-icon, [aria-label="Search"]').first();
    await expect(searchIcon).toBeVisible();
  });

  test('VW-008 | Search returns results for "Golf"', async ({ page }) => {
    await page.goto(BASE_URL);
    const searchIcon = page.locator('[data-testid="search"], .search-icon, [aria-label="Search"]').first();
    await searchIcon.click();
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await searchInput.fill('Golf');
    await searchInput.press('Enter');
    await expect(page.locator('body')).toContainText(/Golf/i);
  });
});

test.describe('Volkswagen - Contact & Dealer Locator', () => {
  test('VW-009 | Dealer locator page is accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/dealer-locator`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('VW-010 | Contact page contains a form or contact details', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    const contactElement = page.locator('form, [data-testid="contact-form"], .contact-info').first();
    await expect(contactElement).toBeVisible();
  });
});

test.describe('Volkswagen - Accessibility & Performance', () => {
  test('VW-011 | Page has a valid lang attribute', async ({ page }) => {
    await page.goto(BASE_URL);
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBeTruthy();
  });

  test('VW-012 | No broken images on homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    const images = page.locator('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const naturalWidth = await images.nth(i).evaluate(img => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('VW-013 | Footer is present and visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('footer')).toBeVisible();
  });

  test('VW-014 | Cookie consent banner appears on first visit', async ({ page }) => {
    await page.goto(BASE_URL);
    const cookieBanner = page.locator('[data-testid="cookie-banner"], .cookie-consent, #cookie-notice').first();
    await expect(cookieBanner).toBeVisible();
  });
});
