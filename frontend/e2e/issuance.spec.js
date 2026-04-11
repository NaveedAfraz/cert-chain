import { test, expect } from '@playwright/test';

test.describe('Certificate Lifecycle', () => {
  // Use a fresh user for this spec or login as a known seed
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
    const randomSuffix = Date.now();
    await page.fill('input[placeholder="e.g. Stanford University"]', `Test Academy ${randomSuffix}`);
    await page.fill('input[placeholder="Full Name"]', 'Issuer Admin');
    await page.fill('input[placeholder="jane@college.edu"]', `issuer_${randomSuffix}@test.com`);
    await page.fill('input[placeholder="Min 6 characters"]', 'password123');
    await page.click('button:has-text("Explore Free Trial")');
    await expect(page).toHaveURL(/.*admin\/dashboard/);
  });

  test('Issue a new certificate successfully', async ({ page }) => {
    // Navigate to issuance via Sidebar if possible, or direct URL
    await page.goto('/admin/issue'); 
    
    await page.fill('input[placeholder="Jane Doe"]', 'John E2E Student');
    // Need to find the exact placeholder for student email
    // Based on the code, it's sibling/similar to name
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('john@e2e.com');
    
    await page.fill('input[placeholder="e.g. B.Sc. in Computer Science"]', 'Modern Web Testing');
    
    await page.click('button:has-text("Secure on Blockchain")');

    // Wait for the animation and success state
    await expect(page.locator('text=Block Secured')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=Certificate has been successfully anchored')).toBeVisible();
    
    // Check if QR code is rendered
    await expect(page.locator('img[alt="Security QR"]')).toBeVisible();
  });

  test('Public verification access', async ({ page }) => {
    await page.goto('/verify');
    await expect(page.locator('h1')).toContainText('Blockchain Public Verification Portal');
    await expect(page.locator('input[placeholder*="ID"]')).toBeVisible();
  });
});
