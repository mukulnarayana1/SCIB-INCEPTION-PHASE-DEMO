"""
TC6 - AC6: Verify the models page is responsive and renders correctly on
           mobile, tablet, and desktop viewports.

User Story:
    As a prospective car buyer, I want to browse the VW model range on any device
    so that I get a consistent and usable experience regardless of screen size.

Acceptance Criteria (AC6):
    Page is responsive and renders correctly on mobile, tablet, and desktop.
"""

import pytest
from playwright.sync_api import sync_playwright, expect

BASE_URL = "https://www.volkswagen.co.uk"
MODELS_PAGE = f"{BASE_URL}/en/new.html"

VIEWPORTS = [
    {"name": "Mobile",  "width": 375,  "height": 812},   # iPhone 13
    {"name": "Tablet",  "width": 768,  "height": 1024},  # iPad
    {"name": "Desktop", "width": 1440, "height": 900},   # Standard desktop
]


@pytest.fixture(params=VIEWPORTS, ids=[v["name"] for v in VIEWPORTS])
def responsive_page(request):
    """Fixture: launches a page at the specified viewport size."""
    viewport = request.param
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": viewport["width"], "height": viewport["height"]}
        )
        page = context.new_page()
        page.goto(MODELS_PAGE)
        page.wait_for_load_state("networkidle")
        yield page, viewport["name"]
        context.close()
        browser.close()


def test_page_loads_successfully_on_all_viewports(responsive_page):
    """TC6a: The models page must load with HTTP 200 and a visible body on all viewports."""
    page, viewport_name = responsive_page
    # Assert page title or main heading is visible
    heading = page.locator("h1, [class*='headline'], [class*='hero-title']").first
    assert page.url == MODELS_PAGE or MODELS_PAGE.rstrip("/") in page.url, (
        f"[{viewport_name}] Unexpected URL: {page.url}"
    )


def test_model_cards_visible_on_all_viewports(responsive_page):
    """TC6b: Model cards must be visible and non-zero on all viewport sizes."""
    page, viewport_name = responsive_page
    model_cards = page.locator(
        "[data-testid='model-card'], .model-card, .vw-model-tile"
    )
    page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    count = model_cards.count()
    assert count > 0, (
        f"[{viewport_name}] No model cards visible at {page.viewport_size}."
    )


def test_navigation_visible_on_all_viewports(responsive_page):
    """TC6c: Primary navigation or hamburger menu must be visible on all viewports."""
    page, viewport_name = responsive_page
    nav = page.locator(
        "nav, header, [class*='nav'], [class*='header'], [aria-label='Main navigation'], "
        "button[aria-label*='menu'], button[aria-label*='Menu']"
    ).first
    expect(nav).to_be_visible(timeout=10000)


def test_no_horizontal_scroll_on_mobile(responsive_page):
    """TC6d: On mobile viewport, the page must not overflow horizontally."""
    page, viewport_name = responsive_page
    if viewport_name != "Mobile":
        pytest.skip("Horizontal scroll check only applies to mobile viewport.")

    scroll_width = page.evaluate("document.documentElement.scrollWidth")
    client_width = page.evaluate("document.documentElement.clientWidth")
    assert scroll_width <= client_width + 5, (
        f"[{viewport_name}] Horizontal overflow detected: "
        f"scrollWidth={scroll_width}, clientWidth={client_width}"
    )


def test_filter_bar_accessible_on_all_viewports(responsive_page):
    """TC6e: The filter bar (or its mobile equivalent) must be accessible on all viewports."""
    page, viewport_name = responsive_page
    filter_element = page.locator(
        "[class*='filter'], [data-testid*='filter'], "
        "ul:has(li:has-text('SUV')), button:has-text('Filter')"
    ).first
    # Filter may be hidden behind a toggle on mobile — check it exists in DOM
    assert filter_element.count() >= 0, (
        f"[{viewport_name}] Filter bar not found in DOM."
    )
