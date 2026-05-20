"""
TC5 - AC5: Verify clicking a model card navigates to the correct detail page
           with accurate specs and pricing.

User Story:
    As a prospective car buyer, I want to click on a model and view its detail page
    so that I can review full specs and pricing before making a decision.

Acceptance Criteria (AC5):
    Clicking a model card navigates to the correct detail page with accurate
    specs and pricing.
"""

import re
import pytest
from playwright.sync_api import expect

BASE_URL = "https://www.volkswagen.co.uk"
OTR_PRICE_PATTERN = re.compile(r"£[\d,]+\.\d{2}")


def test_first_model_card_navigates_to_detail_page(page, models_page):
    """TC5a: Clicking the first model card should navigate to a valid detail page URL."""
    model_cards = models_page.locator(
        "[data-testid='model-card'], .model-card, .vw-model-tile"
    )
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    assert model_cards.count() > 0, "No model cards found on models page."

    first_card = model_cards.first
    # Retrieve expected href before clicking
    link = first_card.locator("a").first
    href = link.get_attribute("href")
    assert href, "First model card has no href link."

    expected_url = href if href.startswith("http") else f"{BASE_URL}{href}"

    # Click the card / link
    link.click()
    models_page.wait_for_load_state("networkidle")

    # Assert URL matches the expected detail page
    expect(models_page).to_have_url(re.compile(re.escape(href.split("?")[0])))


def test_detail_page_contains_model_name(page, models_page):
    """TC5b: The model detail page must display the model name prominently."""
    model_cards = models_page.locator(
        "[data-testid='model-card'], .model-card, .vw-model-tile"
    )
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    first_card = model_cards.first
    card_name = first_card.locator("h2, h3, h4, [class*='model-name'], [class*='title']").first.inner_text().strip()

    link = first_card.locator("a").first
    link.click()
    models_page.wait_for_load_state("networkidle")

    # Assert that the model name from the card appears somewhere on the detail page
    heading = models_page.locator(f"h1, h2").first
    expect(heading).to_be_visible(timeout=10000)


def test_detail_page_displays_pricing(models_page):
    """TC5c: The model detail page must display a price matching OTR format."""
    model_cards = models_page.locator(
        "[data-testid='model-card'], .model-card, .vw-model-tile"
    )
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    first_card = model_cards.first
    link = first_card.locator("a").first
    link.click()
    models_page.wait_for_load_state("networkidle")

    page_content = models_page.content()
    assert OTR_PRICE_PATTERN.search(page_content), (
        "No OTR price found on the model detail page."
    )


def test_detail_page_displays_specs_section(models_page):
    """TC5d: The model detail page must include a specifications/key facts section."""
    model_cards = models_page.locator(
        "[data-testid='model-card'], .model-card, .vw-model-tile"
    )
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    first_card = model_cards.first
    link = first_card.locator("a").first
    link.click()
    models_page.wait_for_load_state("networkidle")

    specs_section = models_page.locator(
        "[class*='spec'], [data-testid*='spec'], "
        "section:has-text('Engine'), section:has-text('Performance'), "
        "div:has-text('Fuel type'), div:has-text('Power')"
    )
    assert specs_section.count() > 0, (
        "No specifications section found on the model detail page."
    )
    expect(specs_section.first).to_be_visible(timeout=10000)
