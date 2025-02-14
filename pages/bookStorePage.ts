import { Page } from '@playwright/test';
import Elementutil from '../utils/UI-Utils/elements-utils';
import { BookStoreLocators } from './locators/bookStoreLocators';

export class BookStorePage {
  private page: Page;
  private utils: Elementutil;

  constructor(page: Page) {
    this.page = page;
    this.utils = new Elementutil(page);
  }

  async navigateToBookStore() {
    await this.utils.performAction(BookStoreLocators.bookStoreAppButton, async (locator) => {
      await locator.click();
    });
  }

  async navigateToLoginPage() {
    await this.utils.performAction(BookStoreLocators.loginButton, async (locator) => {
      await locator.click();
    });
  }

  async login(username: string, password: string) {
    await this.utils.performAction(BookStoreLocators.usernameInput, async (locator) => {
      await locator.fill(username);
    });
    await this.utils.performAction(BookStoreLocators.passwordInput, async (locator) => {
      await locator.fill(password);
    });
    await this.utils.performAction(BookStoreLocators.loginSubmitButton, async (locator) => {
      await locator.click();
    });
  }

  async isLogoutButtonVisible(): Promise<boolean> {
    await this.page.waitForTimeout(3000);
    return this.page.locator(BookStoreLocators.logoutButton).isVisible();
  }

  async logout() {
    await this.utils.performAction(BookStoreLocators.logoutButton, async (locator) => {
      await locator.click();
    });
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return this.page.locator(BookStoreLocators.loginButton).isVisible();
  }
}
