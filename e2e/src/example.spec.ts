import { test, expect } from '@playwright/test';

test('loads the suggestions page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('product-feedback-app-v2');

  // The header renders whether or not any suggestions loaded.
  await expect(page.locator('.header__heading')).toHaveText(
    /^\d+ Suggestions$/,
  );
  await expect(page.getByText(/^Sort by:/)).toBeVisible();
});
