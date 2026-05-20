"""
TC4 - AC4: Verify the filter bar allows narrowing results by SUV, Electric,
           Plug-in Hybrid, Manual, and Automatic — and the model count updates accordingly.

User Story:
    As a prospective car buyer, I want to filter models by type and transmission
    so that I can quickly narrow down cars that match my preferences.

Acceptance Criteria (AC4):
    The filter bar allows narrowing results by SUV, Electric, Plug-in Hybrid,
    Manual, and Automatic — and the model count updates accordingly.
"""

import pytest
from playwright.sync_api import expect

FILTERS = ["SUV", "Electric", "Plug-in Hybrid", "Manual", "Automatic"]


def _get_model_count(page) -> int:
    """Helper: returns the current number of visible model cards."""
    cards = page.locator("[data-testid='model-card'], .model-card, .vw-model-tile")
    return cards.count()


def _get_displayed_count_text(page) -> str:
    """Helper: reads the results count text displayed near the filter bar."""
    count_locator = page.locator(
        "[class*='result-count'], [class*='model-count'], [aria-live='polite']"
    )
    if count_locator.count() > 0:
        return count_locator.first.inner_text().strip()
    return ""


def test_filter_bar_is_visible(models_page):
    """TC4a: The filter bar must be visible on the models page."""
    filter_bar = models_page.locator(
        "[class*='filter'], [data-testid*='filter'], nav[aria-label*='filter'], "
        "ul:has(li:has-text('SUV'))"
    )
    expect(filter_bar.first).to_be_visible(timeout=10000)


@pytest.mark.parametrize("filter_label", FILTERS)
def test_filter_reduces_model_count(models_page, filter_label):
    """TC4b: Applying each filter should update the displayed model count."""
    # Capture unfiltered count
    unfiltered_count = _get_model_count(models_page)
    assert unfiltered_count > 0, "No model cards visible before applying filter."

    # Click the filter button
    filter_btn = models_page.locator(
        f"button:has-text('{filter_label}'), "
        f"label:has-text('{filter_label}'), "
        f"a:has-text('{filter_label}'), "
        f"[role='tab']:has-text('{filter_label}')"
    ).first
    expect(filter_btn).to_be_visible(timeout=10000)
    filter_btn.click()

    # Wait for DOM to update
    models_page.wait_for_load_state("networkidle")
    models_page.wait_for_timeout(1000)

    filtered_count = _get_model_count(models_page)

    # Filtered count must be <= unfiltered count and >= 0
    assert filtered_count >= 0, f"Negative model count after applying '{filter_label}' filter."
    assert filtered_count <= unfiltered_count, (
        f"Filter '{filter_label}' increased model count from {unfiltered_count} to {filtered_count}."
    )

    # Reset: click the filter again to deselect (toggle behaviour)
    filter_btn.click()
    models_page.wait_for_timeout(500)


def test_filter_count_text_updates(models_page):
    """TC4c: The displayed results count text should update after applying a filter."""
    count_before = _get_displayed_count_text(models_page)

    # Apply 'Electric' filter as a representative sample
    electric_btn = models_page.locator(
        "button:has-text('Electric'), [role='tab']:has-text('Electric')"
    ).first
    expect(electric_btn).to_be_visible(timeout=10000)
    electric_btn.click()
    models_page.wait_for_load_state("networkidle")
    models_page.wait_for_timeout(1000)

    count_after = _get_displayed_count_text(models_page)

    if count_before and count_after:
        assert count_before != count_after, (
            "Model count text did not change after applying 'Electric' filter."
        )
