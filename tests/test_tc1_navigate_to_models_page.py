"""
TC1 - AC1: Verify 'Explore our models' navigates to /en/new.html and displays all 32 models.

User Story:
    As a prospective car buyer, I want to browse the full Volkswagen model range
    so that I can compare available cars and find one that suits my needs and budget.

Acceptance Criteria (AC1):
    Clicking 'Explore our models' from the homepage navigates to /en/new.html
    and displays all 32 models.
"""

import pytest
from playwright.sync_api import expect

BASE_URL = "https://www.volkswagen.co.uk"
EXPECTED_MODEL_COUNT = 32


def test_explore_models_link_navigates_to_models_page(page):
    """TC1a: Clicking 'Explore our models' should navigate to /en/new.html."""
    page.goto(BASE_URL)
    page.wait_for_load_state("networkidle")

    # Accept cookies if present
    try:
        page.locator("button:has-text('Accept')").click(timeout=5000)
    except Exception:
        pass  # Cookie banner may not appear

    # Click 'Explore our models'
    explore_link = page.locator("a:has-text('Explore our models')")
    expect(explore_link).to_be_visible(timeout=10000)
    explore_link.click()

    page.wait_for_load_state("networkidle")

    # Assert URL contains /en/new.html
    expect(page).to_have_url(f"{BASE_URL}/en/new.html")


def test_models_page_displays_32_models(models_page):
    """TC1b: The models page should display exactly 32 model cards."""
    # Model cards are identified by a common selector
    model_cards = models_page.locator("[data-testid='model-card'], .model-card, .vw-model-tile")
    
    # Wait for all model cards to be rendered
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )

    actual_count = model_cards.count()
    assert actual_count == EXPECTED_MODEL_COUNT, (
        f"Expected {EXPECTED_MODEL_COUNT} models but found {actual_count}."
    )
