import { expect, test } from '@playwright/test';

test('index page has expected P5 canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas.p5Canvas').first()).toBeVisible();
});
