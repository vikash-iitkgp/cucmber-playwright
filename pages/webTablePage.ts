import { Page } from '@playwright/test';
import { WebTableLocators } from './locators/elementsLocators';
import Elementutil from '../utils/UI-Utils/elements-utils';

export class WebTablePage {
  readonly page: Page;
  private utils: Elementutil;

  constructor(page: Page) {
    this.page = page;
    this.utils = new Elementutil(page);
  }

  async navigateToWebTable() {
    console.log('Navigating to Web Tables...');
    await this.utils.performAction(WebTableLocators.elementsButton, async (locator) => {
      await locator.click();
    });
    await this.utils.performAction(WebTableLocators.webTableMenu, async (locator) => {
      await locator.click();
    });
  }

  async addNewRecord(
    firstName: string,
    lastName: string,
    email: string,
    age: string,
    salary: string,
    department: string
  ) {
    console.log('Adding a new record...');
    await this.utils.performAction(WebTableLocators.addButton, async (locator) => {
      await locator.click();
    });

    await this.utils.performAction(WebTableLocators.firstNameInput, async (locator) => {
      await locator.fill(firstName);
    });
    await this.utils.performAction(WebTableLocators.lastNameInput, async (locator) => {
      await locator.fill(lastName);
    });
    await this.utils.performAction(WebTableLocators.emailInput, async (locator) => {
      await locator.fill(email);
    });
    await this.utils.performAction(WebTableLocators.ageInput, async (locator) => {
      await locator.fill(age);
    });
    await this.utils.performAction(WebTableLocators.salaryInput, async (locator) => {
      await locator.fill(salary);
    });
    await this.utils.performAction(WebTableLocators.departmentInput, async (locator) => {
      await locator.fill(department);
    });

    await this.utils.performAction(WebTableLocators.submitButton, async (locator) => {
      await locator.click();
    });
  }
  async isRecordAdded(): Promise<boolean> {
    console.log('Checking if record was successfully added...');
    return await this.utils.checkElementState(WebTableLocators.formModel, 'visible');
  }
  async isFormModelVisible(): Promise<boolean> {
    console.log('Checking if record was successfully added...');
    return await this.utils.checkElementState(WebTableLocators.formModel, 'visible');
  }

  async searchRecord(query: string) {
    console.log(`Searching for record with query: ${query}`);
    await this.utils.performAction(WebTableLocators.searchBox, async (locator) => {
      await locator.fill(query);
    });
  }

  async closeForm() {
    console.log('Closing the form...');
    await this.utils.performAction(WebTableLocators.closeButton, async (locator) => {
      await locator.click();
    });
  }

  async deleteFirstRecord() {
    console.log('Deleting the first record...');
    await this.utils.performAction(WebTableLocators.deleteButton, async (locator) => {
      await locator.first().click();
    });
  }

  async editFirstRecord(newDepartment: string) {
    console.log('Editing the first record...');
    await this.utils.performAction(WebTableLocators.editButton, async (locator) => {
      await locator.first().click();
    });
    await this.utils.performAction(WebTableLocators.departmentInput, async (locator) => {
      await locator.fill(newDepartment);
    });
    await this.utils.performAction(WebTableLocators.submitButton, async (locator) => {
      await locator.click();
    });
  }

  async getRowCount(): Promise<number> {
    console.log('Getting the number of rows in the table...');
    return await this.page.locator(WebTableLocators.tableRows).count();
  }
}
