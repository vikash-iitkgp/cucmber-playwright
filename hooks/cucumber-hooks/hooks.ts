import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();

setDefaultTimeout(100000); // Set default timeout for all steps

let browser: Browser;
let page: Page;

BeforeAll({}, async () => {
  console.log('🔥 Launching browser...');
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});



AfterAll(async () => {
    
  console.log('🛑 Closing browser...');
  await browser.close();
});

export { page };
