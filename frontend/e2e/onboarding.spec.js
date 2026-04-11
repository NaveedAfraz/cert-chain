import { test, expect } from '@playwright/test';

test.describe('Institutional Onboarding & Auth', () => {
  test('Complete Signup and Login Lifecycle', async ({ page }) => {
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const instName = `E2E Academy ${randomSuffix}`;
    const email = `admin_${randomSuffix}@e2e.com`;
    const password = 'Password123!';

    // 1. Signup
    await page.goto('/signup');
    await page.fill('input[placeholder="e.g. Stanford University"]', instName);
    await page.fill('input[placeholder="Full Name"]', 'E2E Admin');
    await page.fill('input[placeholder="jane@college.edu"]', email);
    await page.fill('input[placeholder="Min 6 characters"]', password);
    await page.click('button:has-text("Explore Free Trial")');
    
    await expect(page).toHaveURL(/.*admin\/dashboard/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Institutional Overview');

    // 2. Logout (Mocked by clearing storage)
    await page.evaluate(() => localStorage.clear());
    await page.goto('/login');

    // 3. Login
    await page.fill('input[placeholder="admin@institution.edu"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button:has-text("Sign in to Portal")');
    
    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.locator('h1')).toContainText('Institutional Overview');
  });
});
