import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the index.html file
        # The script is in the root, and the file is in frontend/
        file_path = os.path.abspath('frontend/index.html')

        # Navigate to the local HTML file
        page.goto(f'file://{file_path}')

        # 1. Verify the initial state
        expect(page.locator("#lift-status")).to_have_text("idle")
        expect(page.locator("#delivery-queue")).to_be_empty()

        # 2. Dispatch a package to Floor 5
        page.locator("#floor-input").fill("5")
        page.locator("#package-input").fill("Groceries")
        page.locator('button[type="submit"]').click()

        # 3. Assert that the queue and lift status update immediately
        expect(page.locator("#lift-status")).to_have_text("moving")
        expect(page.locator("#delivery-queue")).to_be_empty() # It's removed from queue and processed

        # Check if the pod is visually updated (has the package name)
        # This is a bit tricky as we don't know which pod will be used,
        # but we can check if at least one pod has the text.
        expect(page.locator(".pod:has-text('Grocerie')")).to_be_visible()

        # 4. Take a screenshot of the active state
        screenshot_path = "verification.png"
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run_verification()