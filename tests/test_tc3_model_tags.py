"""
TC3 - AC3: Verify models are tagged correctly (e.g. 'Electric', 'Plug-in Hybrid available',
           'Coming soon', 'The May Event').

User Story:
    As a prospective car buyer, I want to see tags on model cards
    so that I can quickly identify electric, hybrid, or upcoming vehicles.

Acceptance Criteria (AC3):
    Models are tagged where applicable (e.g. 'Electric', 'Plug-in Hybrid available',
    'Coming soon', 'The May Event').
"""

import pytest
from playwright.sync_api import expect

EXPECTED_TAGS = [
    "Electric",
    "Plug-in Hybrid available",
    "Coming soon",
    "The May Event",
]


def test_at_least_one_electric_tag_present(models_page):
    """TC3a: At least one model card must carry the 'Electric' tag."""
    electric_tags = models_page.locator(
        "[class*='tag']:has-text('Electric'), [class*='badge']:has-text('Electric'), "
        "span:has-text('Electric'), div:has-text('Electric')"
    )
    count = electric_tags.count()
    assert count >= 1, "No 'Electric' tag found on any model card."


def test_at_least_one_plug_in_hybrid_tag_present(models_page):
    """TC3b: At least one model card must carry the 'Plug-in Hybrid available' tag."""
    hybrid_tags = models_page.locator(
        "[class*='tag']:has-text('Plug-in Hybrid'), [class*='badge']:has-text('Plug-in Hybrid'), "
        "span:has-text('Plug-in Hybrid available')"
    )
    count = hybrid_tags.count()
    assert count >= 1, "No 'Plug-in Hybrid available' tag found on any model card."


def test_coming_soon_tag_visible_when_applicable(models_page):
    """TC3c: If a 'Coming soon' model exists, the tag must be visible."""
    coming_soon_tags = models_page.locator(
        "[class*='tag']:has-text('Coming soon'), span:has-text('Coming soon'), "
        "div:has-text('Coming soon')"
    )
    count = coming_soon_tags.count()
    # 'Coming soon' is optional — only assert visibility if the tag exists in DOM
    if count > 0:
        for i in range(count):
            expect(coming_soon_tags.nth(i)).to_be_visible(timeout=5000)


def test_event_tag_visible_when_applicable(models_page):
    """TC3d: If a promotional event tag (e.g. 'The May Event') is present, it must be visible."""
    event_tags = models_page.locator(
        "[class*='tag']:has-text('Event'), span:has-text('Event'), "
        "div:has-text('The May Event')"
    )
    count = event_tags.count()
    # Event tags are promotional/optional — only assert visibility if present
    if count > 0:
        for i in range(count):
            expect(event_tags.nth(i)).to_be_visible(timeout=5000)


def test_tags_belong_to_expected_set(models_page):
    """TC3e: All visible tags on model cards must belong to the expected tag set."""
    tag_elements = models_page.locator("[class*='tag'], [class*='badge'][class*='model']")
    count = tag_elements.count()

    for i in range(count):
        tag_text = tag_elements.nth(i).inner_text().strip()
        if tag_text:
            assert any(expected in tag_text for expected in EXPECTED_TAGS), (
                f"Unexpected tag found: '{tag_text}'. "
                f"Expected one of: {EXPECTED_TAGS}"
            )
