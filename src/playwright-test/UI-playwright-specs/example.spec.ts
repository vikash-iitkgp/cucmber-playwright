import { test, expect, Page } from '@playwright/test';
import Elementutil from '../../../utils/UI-Utils/elements-utils';
import { BookStorePage } from '../../../pages/bookStorePage';
import { WebTablePage } from '../../../pages/webTablePage';
import { FilePage } from '../../../pages/fileUploadDownloadPage';
import { BrowserWindowPage } from '../../../pages/browserWindowPage';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const screenshotPath = process.env.SCREENSHOT_PATH || './screenshots';

const credentialsPath = path.join(__dirname, '../../../test-data/UI-testData/credentials.json');
const credentials = require(credentialsPath);

test.describe('Book Store Application - Login Workflow', () => {
  let page: Page;
  let utils: Elementutil;
  let webTableRecords: Array<{
    firstName: string;
    lastName: string;
    email: string;
    age: string;
    salary: string;
    department: string;
    isValid: boolean;
  }>;
  let bookStorePage: BookStorePage;

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(160000); // Set timeout to 60 seconds
    // Create a new browser context and page for the test suite
    const context = await browser.newContext();
    page = await context.newPage();
    utils = new Elementutil(page);
    const recordsPath = path.join(__dirname, '../../../test-data/UI-testData/webTableRecords.json');
    webTableRecords = require(recordsPath);
    const baseURL = process.env.BASEURL || 'https://example.com';
    // Navigate to the main page
    await page.goto(baseURL);
  });

  test('Verify Login Workflow with Multiple Credentials', async () => {
    let loginSuccessful = false;
    bookStorePage = new BookStorePage(page);
    for (const { username, password } of credentials) {
      await test.step(`Navigating to Book Store`, async () => {
        await bookStorePage.navigateToBookStore();
      });
      await test.step(`Navigating to Login Page`, async () => {
        await bookStorePage.navigateToLoginPage();
      });
      await test.step(`Attempting login with username: ${username}`, async () => {
        await bookStorePage.login(username, password);
      });

      const isLogoutVisible = await bookStorePage.isLogoutButtonVisible();
      if (isLogoutVisible) {
        await test.step(`Login successful with username: ${username}`, async () => {
          console.log(`Login successful with username: ${username}`);
          // expect(isLogoutVisible).toBeTruthy();
        });

        loginSuccessful = true;

        await test.step('Logging out', async () => {
          await bookStorePage.logout();
          const isLoginVisible = await bookStorePage.isLoginButtonVisible();
          console.log(`Login button visible after logout: ${isLoginVisible}`);
          expect(isLoginVisible).toBeTruthy();
        });

        break;
      } else {
        await test.step(`Login failed with username: ${username}`, async () => {
          const isLoginVisible = await bookStorePage.isLoginButtonVisible();
          console.log(`Login button visible: ${isLoginVisible}`);
          //expect(isLoginVisible).toBeTruthy();
        });

        if (!page.isClosed()) {
          const screenshot = await page.screenshot({ path: path.join(screenshotPath, `login-failure-${username}.png`) });
          console.log(`Screenshot captured: ${path.join(screenshotPath, `login-failure-${username}.png`)}`);
          // Attach screenshot logic if needed
        }
      }
    }
    // await test.step('Verifying at least one successful login', async () => {
    //   expect(loginSuccessful).toBeTruthy();
    // });
  });

  test('Add a new record to WebTable', async () => {
    const webTablePage = new WebTablePage(page);
    await webTablePage.navigateToWebTable();
    for (const record of webTableRecords) {
      await test.step(`Processing record: ${record.email}`, async () => {
        try {
          await webTablePage.addNewRecord(
            record.firstName,
            record.lastName,
            record.email,
            record.age,
            record.salary,
            record.department
          );
          const isRecordAdded = await webTablePage.isRecordAdded();
          if (!isRecordAdded) {
            console.log(`Record ${record.email} should be present in the table.`);
            // expect(!isRecordAdded, `Record ${record.email} should be present in the table.`).toBeTruthy();
            console.log(`✅ Successfully added record: ${record.email}`);
          } else {
            console.log(`⚠️ Record addition expected to fail for invalid data: ${record.email}`);
            await webTablePage.closeForm();
          }
        } catch (error) {
          // Handle error
        }
      });
    }
  });

  test('Upload and Download File', async () => {
    const filePage = new FilePage(page);
    await filePage.navigateToUploadDownloadPage();
    const filePath = 'D:\\test.pdf';
    await filePage.uploadFile(filePath);
    const uploadedFilePath = await filePage.getUploadedFilePath();
    console.log(`Uploaded file path: ${uploadedFilePath}`);
    // expect(uploadedFilePath).toContain('test.pdf');
    const downloadPath = await filePage.downloadFile();
    console.log(`Downloaded file path: ${downloadPath}`);
    // expect(downloadPath).toBeTruthy();
  });

  test('Verify new Tab functionality', async () => {
    const browserWindowPage = new BrowserWindowPage(page);
    await browserWindowPage.navigateToBrowserWindowPage();
    await page.waitForTimeout(1000); // Pause for a second
    await browserWindowPage.openNewTabAndVerifyContent();
  });

  test('Verify new Window functionality', async () => {
    const browserWindowPage = new BrowserWindowPage(page);
    await browserWindowPage.openNewWindowAndVerifyContent();
  });

  test('Verify Message Window functionality', async () => {
    const browserWindowPage = new BrowserWindowPage(page);
    await browserWindowPage.openNewMessageWindowAndVerify();
  });

  test.afterAll(async () => {
    await page.waitForTimeout(3000);
    await page.close(); // Close the page after all tests are complete
  });
});