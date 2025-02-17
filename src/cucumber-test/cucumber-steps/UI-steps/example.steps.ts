import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import Elementutil from '../../../../utils/UI-Utils/elements-utils';
import { BookStorePage } from '../../../../pages/bookStorePage';
import { WebTablePage } from '../../../../pages/webTablePage';
import { FilePage } from '../../../../pages/fileUploadDownloadPage';
import { BrowserWindowPage } from '../../../../pages/browserWindowPage';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { chromium } from "playwright";
import { page } from '../../../../hooks/cucumber-hooks/hooks';
dotenv.config();

const screenshotPath = process.env.SCREENSHOT_PATH || './screenshots';
const credentialsPath = path.join(__dirname, '../../../../test-data/UI-testData/credentials.json');
const credentials = require(credentialsPath);
const recordsPath = path.join(__dirname, '../../../../test-data/UI-testData/webTableRecords.json');
const webTableRecords = require(recordsPath);
const baseURL = process.env.BASEURL || 'https://example.com';

//let page: Page;
let utils: Elementutil;
let bookStorePage: BookStorePage;

Given('I navigate to the Book Store', { timeout: 100000 }, async () => {
  // const browser = await chromium.launch({ headless: false });
  // const context = await browser.newContext();
  // page = await context.newPage();
  utils = new Elementutil(page);
  await page.goto(baseURL, { timeout: 160000 }); // Increased timeout to 60000ms
  bookStorePage = new BookStorePage(page);
});

When('I attempt to login with multiple credentials', { timeout: 100000 }, async () => {
  for (const { username, password } of credentials) {
    await bookStorePage.navigateToBookStore();
    await bookStorePage.navigateToLoginPage();
    await bookStorePage.login(username, password);

    const isLogoutVisible = await bookStorePage.isLogoutButtonVisible();
    if (isLogoutVisible) {
      console.log(`Login successful with username: ${username}`);
      await bookStorePage.logout();
      break;
    } else {
      const screenshot = await page.screenshot({ path: path.join(screenshotPath, `login-failure-${username}.png`) });
      console.log(`Screenshot captured: ${path.join(screenshotPath, `login-failure-${username}.png`)}`);
    }
  }
});

Then('I should see the logout button if login is successful', { timeout: 100000 }, async () => {
  const isLogoutVisible = await bookStorePage.isLogoutButtonVisible();
  expect(isLogoutVisible).toBeTruthy();
});

Then('I should see the login button if login fails', { timeout: 10000 }, async () => {
  const isLoginVisible = await bookStorePage.isLoginButtonVisible();
  expect(isLoginVisible).toBeTruthy();
});

Given('I navigate to the WebTable page', { timeout: 10000 }, async () => {
  const webTablePage = new WebTablePage(page);
  await webTablePage.navigateToWebTable();
});

When('I add new records to the WebTable', { timeout: 10000 }, async () => {
  const webTablePage = new WebTablePage(page);
  for (const record of webTableRecords) {
    await webTablePage.addNewRecord(
      record.firstName,
      record.lastName,
      record.email,
      record.age,
      record.salary,
      record.department
    );
  }
});

Then('I should see the records in the table', { timeout: 10000 }, async () => {
  const webTablePage = new WebTablePage(page);
  for (const record of webTableRecords) {
    const isRecordAdded = await webTablePage.isRecordAdded();
    expect(isRecordAdded).toBeTruthy();
  }
});

Given('I navigate to the Upload Download page', { timeout: 10000 }, async () => {
  const filePage = new FilePage(page);
  await filePage.navigateToUploadDownloadPage();
});

When('I upload a file', { timeout: 10000 }, async () => {
  const filePage = new FilePage(page);
  const filePath = 'D:\\test.pdf';
  await filePage.uploadFile(filePath);
});

Then('I should see the uploaded file path', { timeout: 10000 }, async () => {
  const filePage = new FilePage(page);
  const uploadedFilePath = await filePage.getUploadedFilePath();
  expect(uploadedFilePath).toContain('test.pdf');
});

When('I download a file', { timeout: 10000 }, async () => {
  const filePage = new FilePage(page);
  const downloadPath = await filePage.downloadFile();
  expect(downloadPath).toBeTruthy();
});

Then('I should see the downloaded file path', { timeout: 10000 }, async () => {
  const filePage = new FilePage(page);
  const downloadPath = await filePage.downloadFile();
  expect(downloadPath).toBeTruthy();
});

Given('I navigate to the Browser Window page', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.navigateToBrowserWindowPage();
});

When('I open a new tab', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.openNewTabAndVerifyContent();
});

Then('I should verify the content of the new tab', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.openNewTabAndVerifyContent();
});

When('I open a new window', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.openNewWindowAndVerifyContent();
});

Then('I should verify the content of the new window', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.openNewWindowAndVerifyContent();
});

When('I open a new message window', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.openNewMessageWindowAndVerify();
});

Then('I should verify the content of the message window', { timeout: 10000 }, async () => {
  const browserWindowPage = new BrowserWindowPage(page);
  await browserWindowPage.openNewMessageWindowAndVerify();
});