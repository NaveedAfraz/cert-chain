# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.js >> Institutional Onboarding & Auth >> Complete Signup and Login Lifecycle
- Location: e2e\onboarding.spec.js:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="admin@institution.edu"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "CertChain" [ref=e6] [cursor=pointer]:
        - /url: /
        - img [ref=e8]
        - generic [ref=e10]: CertChain
      - generic [ref=e11]:
        - link "Home" [ref=e12] [cursor=pointer]:
          - /url: /
        - link "Public Verifier" [ref=e13] [cursor=pointer]:
          - /url: /verify
        - link "SaaS Pricing" [ref=e14] [cursor=pointer]:
          - /url: /pricing
      - generic [ref=e16]:
        - link "Log In" [ref=e17] [cursor=pointer]:
          - /url: /login
        - link "Start Free Trial" [ref=e18] [cursor=pointer]:
          - /url: /signup
  - main [ref=e19]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]:
          - img [ref=e25]
          - heading "Sign In" [level=1] [ref=e28]
          - paragraph [ref=e29]: Access your institutional portal
        - generic [ref=e30]:
          - generic [ref=e31]:
            - text: Email Address
            - generic [ref=e32]:
              - img [ref=e33]
              - textbox "admin@college.edu" [ref=e36]
          - generic [ref=e37]:
            - generic [ref=e38]:
              - generic [ref=e39]: Password
              - link "Forgot?" [ref=e40] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e41]:
              - img [ref=e42]
              - textbox "••••••••" [ref=e45]
          - button "Log In" [ref=e46]:
            - text: Log In
            - img [ref=e47]
        - paragraph [ref=e50]:
          - text: Need a portal for your college?
          - link "Start Free Trial" [ref=e51] [cursor=pointer]:
            - /url: /signup
      - generic [ref=e52]:
        - paragraph [ref=e53]: Quick Access Demo
        - generic [ref=e54]:
          - paragraph [ref=e55]: "Super Admin: admin@certchain.io / admin123"
          - paragraph [ref=e56]: "College Admin: jane@global.edu / college123"
  - contentinfo [ref=e57]:
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - img [ref=e61]
          - generic [ref=e63]: CertChain
        - paragraph [ref=e64]: The next generation of academic credentialing. Immutable, cryptographic, and instantly verifiable by anyone in the world.
      - generic [ref=e65]:
        - heading "Protocol" [level=4] [ref=e66]
        - list [ref=e67]:
          - listitem [ref=e68]:
            - link "Smart Contract" [ref=e69] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e70]:
            - link "Consensus Mechanism" [ref=e71] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e72]:
            - link "Whitepaper" [ref=e73] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e74]:
        - heading "Resources" [level=4] [ref=e75]
        - list [ref=e76]:
          - listitem [ref=e77]:
            - link "About the Project" [ref=e78] [cursor=pointer]:
              - /url: /about
          - listitem [ref=e79]:
            - link "Developer API" [ref=e80] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e81]:
            - link "FAQ" [ref=e82] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e83]:
        - heading "Trust Metrics" [level=4] [ref=e84]
        - generic [ref=e85]:
          - generic [ref=e86]:
            - img [ref=e87]
            - text: AES-256 Encryption
          - generic [ref=e90]:
            - img [ref=e91]
            - text: <2s Verification Time
          - generic [ref=e93]:
            - img [ref=e94]
            - text: Public Ledger Audit
    - generic [ref=e96]: © 2026 CertChain Global Prototype. All rights reserved. Built for academic excellence.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Institutional Onboarding & Auth', () => {
  4  |   test('Complete Signup and Login Lifecycle', async ({ page }) => {
  5  |     const randomSuffix = Math.floor(Math.random() * 1000000);
  6  |     const instName = `E2E Academy ${randomSuffix}`;
  7  |     const email = `admin_${randomSuffix}@e2e.com`;
  8  |     const password = 'Password123!';
  9  | 
  10 |     // 1. Signup
  11 |     await page.goto('/signup');
  12 |     await page.fill('input[placeholder="e.g. Stanford University"]', instName);
  13 |     await page.fill('input[placeholder="Full Name"]', 'E2E Admin');
  14 |     await page.fill('input[placeholder="jane@college.edu"]', email);
  15 |     await page.fill('input[placeholder="Min 6 characters"]', password);
  16 |     await page.click('button:has-text("Explore Free Trial")');
  17 |     
  18 |     await expect(page).toHaveURL(/.*admin\/dashboard/, { timeout: 15000 });
  19 |     await expect(page.locator('h1')).toContainText('Institutional Overview');
  20 | 
  21 |     // 2. Logout (Mocked by clearing storage)
  22 |     await page.evaluate(() => localStorage.clear());
  23 |     await page.goto('/login');
  24 | 
  25 |     // 3. Login
> 26 |     await page.fill('input[placeholder="admin@institution.edu"]', email);
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  27 |     await page.fill('input[type="password"]', password);
  28 |     await page.click('button:has-text("Sign in to Portal")');
  29 |     
  30 |     await expect(page).toHaveURL(/.*admin\/dashboard/);
  31 |     await expect(page.locator('h1')).toContainText('Institutional Overview');
  32 |   });
  33 | });
  34 | 
```