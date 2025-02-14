import { Page } from '@playwright/test';
import Elementutil from '../utils/UI-Utils/elements-utils';
import { AlertLocators } from './locators/alertFrameWindowaLocators';

export class AlertsPage {
  readonly page: Page;
  private utils: Elementutil;

  constructor(page: Page) {
    this.page = page;
    this.utils = new Elementutil(page);
  }

  async navigateToAlertsPage() {
    await this.utils.waitForElementToBeVisible(AlertLocators.alertsFrameWindowsMenu);
    await this.utils.waitForElementToBeVisible(AlertLocators.alertsMenu);
    await this.utils.performAction(AlertLocators.alertsFrameWindowsMenu, async (locator) => {
      await locator.click();
    });
    await this.utils.performAction(AlertLocators.alertsMenu, async (locator) => {
      await locator.click();
    });
  }

  async clickAlertButton() {
    await this.utils.performAction(AlertLocators.alertButton, async (locator) => {
      await locator.click();
    });
  }

  async clickConfirmButton() {
    await this.utils.performAction(AlertLocators.confirmButton, async (locator) => {
      await locator.click();
    });
  }

  async clickPromptButton() {
    await this.utils.performAction(AlertLocators.promptButton, async (locator) => {
      await locator.click();
    });
  }

  async acceptAlert() {
    await this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async dismissAlert() {
    await this.page.on('dialog', async dialog => {
      await dialog.dismiss();
    });
  }

  async getAlertMessage(): Promise<string> {
    let alertText = '';
    await this.page.on('dialog', async dialog => {
      alertText = dialog.message();
      await dialog.accept();
    });
    return alertText;
  }

  async enterTextInPromptAlert(text: string) {
    await this.page.on('dialog', async dialog => {
      await dialog.accept(text);
    });
  }
}
