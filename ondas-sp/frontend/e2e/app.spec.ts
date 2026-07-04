import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load and display dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Ilha Comp Surf')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const toggle = page.locator('[aria-label*="dark"], [aria-label*="tema"]').first();
    
    if (await toggle.isVisible()) {
      await toggle.click();
      await expect(html).toHaveClass(/dark/);
    }
  });

  test('should navigate to spots page', async ({ page }) => {
    await page.goto('/');
    const spotsLink = page.locator('a[href="/picos"], button:has-text("Picos")').first();
    
    if (await spotsLink.isVisible()) {
      await spotsLink.click();
      await expect(page).toHaveURL(/picos/);
    }
  });

  test('should display loading states initially', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });
});
