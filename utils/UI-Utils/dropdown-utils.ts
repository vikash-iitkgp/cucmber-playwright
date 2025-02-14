import { Page } from "playwright-core";
import { expect } from '@playwright/test';

export default class Dropdown {

  page: Page;

  evalString: string;

  constructor(page: Page) {
	this.page = page;
  }

  // Selects an option from a dropdown by its value.
  async selectDropdownByValue(element: string, dropdownText: string): Promise<void> {
	try {
	  const selectElement = await this.page.locator(element);
	  await selectElement.selectOption({ value: dropdownText });
	} catch (error) {
	  console.error(`Error selecting option: ${dropdownText} in element: ${element}`, error);
	  throw error;
	}
  }

  // Selects an option from a dropdown by its visible text.
  async selectDropdownByText(element: string, dropdownText: string): Promise<void> {
	try {
	  const selectElement = await this.page.locator(element);
	  await selectElement.selectOption({ label: dropdownText });
	} catch (error) {
	  console.error(`Error selecting option: ${dropdownText} in element: ${element}`, error);
	  throw error;
	}
  }
}