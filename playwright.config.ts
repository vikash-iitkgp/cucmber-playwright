import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/playwright-test', // Update this path if needed
  use: {
    browserName: 'chromium', // You can change this to 'firefox' or 'webkit'
    headless: false,
  },
});
