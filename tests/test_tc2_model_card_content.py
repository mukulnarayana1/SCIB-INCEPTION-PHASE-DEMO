"""
TC2 - AC2: Verify each model card shows model name, starting OTR price, and a clickable link.

User Story:
    As a prospective car buyer, I want to see key details on each model card
    so that I can quickly compare cars without navigating away.

Acceptance Criteria (AC2):
    Each model card shows the model name, starting OTR price (e.g. 'From £28,910.00'),
    and a clickable link to the model detail page.
"""

import re
import pytest
from playwright.sync_api import expect


# Regex pattern for OTR price: e.g. "From £28,910.00"
OTR_PRICE_PATTERN = re.compile(r"From £[\d,]+\.\d{2}")


def test_model_cards_display_model_name(models_page):
    """TC2a: Each model card must display a visible model name."""
    model_cards = models_page.locator("[data-testid='model-card'], .model-card, .vw-model-tile")
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    count = model_cards.count()
    assert count > 0, "No model cards found on the page."

    for i in range(count):
        card = model_cards.nth(i)
        # Model name is typically inside a heading or strong element within the card
        name_locator = card.locator("h2, h3, h4, [class*='model-name'], [class*='title']").first
        expect(name_locator).to_be_visible(timeout=5000)
        name_text = name_locator.inner_text().strip()
        assert name_text, f"Model name is empty for card index {i}."


def test_model_cards_display_otr_price(models_page):
    """TC2b: Each model card must display a starting OTR price in the format 'From £XX,XXX.XX'."""
    model_cards = models_page.locator("[data-testid='model-card'], .model-card, .vw-model-tile")
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    count = model_cards.count()
    assert count > 0, "No model cards found on the page."

    for i in range(count):
        card = model_cards.nth(i)
        card_text = card.inner_text()
        assert OTR_PRICE_PATTERN.search(card_text), (
            f"Card index {i} does not contain a valid OTR price. Card text: {card_text[:200]}"
        )


def test_model_cards_have_clickable_links(models_page):
    """TC2c: Each model card must contain at least one clickable anchor link."""
    model_cards = models_page.locator("[data-testid='model-card'], .model-card, .vw-model-tile")
    models_page.wait_for_selector(
        "[data-testid='model-card'], .model-card, .vw-model-tile",
        timeout=15000
    )
    count = model_cards.count()
    assert count > 0, "No model cards found on the page."

    for i in range(count):
        card = model_cards.nth(i)
        link = card.locator("a").first
        expect(link).to_be_visible(timeout=5000)
        href = link.get_attribute("href")
        assert href and href.strip() != "", (
            f"Card index {i} has an anchor tag with no valid href."
        )
