import { expect } from '@playwright/test';

type WaitForOptions = {
  state?: "visible" | "detached" | "attached" | "hidden";
  timeout?: number;
};

export default class Verification {
  page: any;
  evalstring: string;

  constructor(page: any) {
	this.page = page;
  }

  // Performs an action on an element after waiting for a specified state.
  async performAction<T>(
  element: any,
  action: (locator: any) => Promise<T>,
  options: WaitForOptions = { state: "visible", timeout: 60000 }
  ): Promise<T> {
	try {
	  if (!element) {
		throw new Error('Element selector is undefined or empty');
	  }

	  const locator = this.page.locator(element);

	  if (!locator) {
		throw new Error(`Locator for element '${element}' not found`);
	  }

	  await locator.waitFor(options);

	  return await action(locator);
	} catch (error) {
	  console.error(`Error performing action on element: ${element}`, error);
	  throw error;
	}
  }
  // Checks the state of an element.

async checkElementState(element: string, state: string): Promise<boolean> {
  try {
    const locator = this.page.locator(element);
    await locator.waitFor({ state });
    return true;
  } catch (error) {
    console.error(`Error checking element state '${state}' for: ${element}`, error);
    return false;
  }
}

// Verifies if an element is hidden.
async elementIsHidden(element: string): Promise<boolean> {
  return this.checkElementState(element, "hidden");
}

// Verifies if an element is disabled.
async elementIsDisabled(element: string): Promise<boolean> {
  return this.checkElementState(element, "disabled");
}

// Verifies if an element is visible.
async elementIsVisible(element: string): Promise<boolean> {
  return this.performAction(element, async (locator) => locator.isVisible(), { state: "visible", timeout: 60 * 1000 }) as Promise<boolean>;
}

// Gets the text content of an element.
async getTextContent(element: string): Promise<string | null> {
  return this.performAction(element, async (locator) => locator.textContent());
}

// Gets the value of an attribute of an element.
async getAttributeValue(element: string, attribute: string): Promise<string | null> {
  return this.performAction(element, async (locator) => locator.getAttribute(attribute));
}

// Compares the text of an element with the expected text.
async textComparison(element: string, expectedText: string): Promise<void> {
  try {
    await expect(this.page.locator(element)).toHaveText(expectedText);
    console.log(`Text matches the expected value: ${expectedText}`);
  } catch (error) {
    console.error(`Text does not match: ${expectedText}`);
    throw error;
  }
}

// Compares the partial text of an element with the expected text.
async partialTextComparison(element: string, expectedText: string): Promise<void> {
  try {
    await expect(this.page.locator(element)).toContainText(expectedText);
    console.log(`Text matches the expected value: ${expectedText}`);
  } catch (error) {
    console.error(`Text does not match: ${expectedText}`);
    throw error;
  }
}

// Verifies if an element is enabled.
async elementEnabled(element: string): Promise<void> {
  try {
    await expect(this.page.locator(element)).toBeEnabled();
    console.log(`${element} is enabled`);
  } catch (error) {
    console.error(`${element} is not enabled`);
    throw error;
  }
}
// Verifies if an element is disabled.

async elementDisabled(element: string): Promise<void> {
  try {
    await expect(this.page.locator(element)).toBeDisabled();
    console.log(`${element} is disabled`);
  } catch (error) {
    console.error(`${element} is not disabled`);
    throw error;
  }
}

// Verifies the count of elements.
async verifyCount(element: string, expectedCount: number): Promise<void> {
  const locator = this.page.locator(element);
  const locatorCount: number=await locator.count();
  try {
    expect(locatorCount).toBe(expectedCount);
    console.log(`Count matches the expected: ${locatorCount}`);
  } catch (error) {
    console.error(`Count does not match: ${locatorCount}`);
    throw error;
  }
}

// Verifies the attribute values of a list of elements.
async verifyAttributeList(element: string, expectedText: any[], attribute: string): Promise<void> {
  const locators = await this.page.$$(element);
  if (locators.length !== expectedText.length) {
    console.error("Count of elements does not match expected text array length!");
    throw new Error('Element count and expected text length mismatch.');
  }

  try {
    for (let i = 0; i < locators.length; i++) {
      const attributeValue = await locators[i].getAttribute(attribute);
      expect(attributeValue?.trim()).toBe(expectedText[i].trim());
      console.log(`Element ${i + 1} text matches: ${attributeValue?.trim()}`);
    }
  } catch (error) {
    console.error(`Error verifying attribute list: ${error}`);
    throw error;
  }
}
}