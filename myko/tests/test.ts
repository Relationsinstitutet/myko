import { expect, test } from '@playwright/test';

test('index page has expected P5 canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#canvasContainer > canvas').first()).toBeVisible();
});
