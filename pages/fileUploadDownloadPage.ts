import { Page } from '@playwright/test';
import { FileLocators } from './locators/elementsLocators';
import Elementutil from '../utils/UI-Utils/elements-utils';

export class FilePage {
  readonly page: Page;
  private utils: Elementutil;

  constructor(page: Page) {
    this.page = page;
    this.utils = new Elementutil(page);
  }

  async navigateToUploadDownloadPage() {
    await this.utils.performAction(FileLocators.uploadAndDownloadMenu, async (locator) => {
      await locator.click();
    });
  }

  async uploadFile(filePath: string) {
    console.log('Uploading a file...');
    await this.page.setInputFiles(FileLocators.uploadButton, filePath);
  }

  async getUploadedFilePath(): Promise<string> {
    console.log('Fetching uploaded file path...');
    return "";
    // return await this.utils.performAction(FileLocators.uploadedFilePath, async (locator) => {
    //   return await locator.textContent();
    // });
  }

  async downloadFile() {
    console.log('Downloading a file...');
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.utils.performAction(FileLocators.downloadButton, async (locator) => {
        await locator.click();
      })
    ]);
    const downloadPath = await download.path();
    console.log(`File downloaded to: ${downloadPath}`);
    return downloadPath;
  }
}
