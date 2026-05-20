import pytest
from playwright.sync_api import sync_playwright

BASE_URL = "https://www.volkswagen.co.uk"
MODELS_PAGE = f"{BASE_URL}/en/new.html"


@pytest.fixture(scope="session")
def browser():
    """Launch Chromium browser for the test session."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        yield browser
        browser.close()


@pytest.fixture(scope="function")
def page(browser):
    """Create a new browser page for each test."""
    context = browser.new_context()
    page = context.new_page()
    yield page
    context.close()


@pytest.fixture(scope="function")
def models_page(page):
    """Navigate to the VW models listing page before each test."""
    page.goto(MODELS_PAGE)
    page.wait_for_load_state("networkidle")
    return page
