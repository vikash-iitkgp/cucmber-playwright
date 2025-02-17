import { test, expect, Page } from '@playwright/test';

// let browser: Browser;
// let page: Page;

// BeforeAll(async () => {
//   browser = await chromium.launch({ headless: false });
// });

// Before(async function () {
//   const context = await browser.newContext();
//   page = await context.newPage();
//   this.page = page; // Attach page object to test context
// });

// After(async function (scenario) {
//   if (scenario.result?.status === Status.FAILED) {
//     const screenshot = await page.screenshot();
//     this.attach(screenshot, 'image/png');
//   }
//   await page.close();
// });

// AfterAll(async () => {
//   await browser.close();
// });
