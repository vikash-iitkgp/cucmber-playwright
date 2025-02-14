type WaitForOptions = {
    state: "attached" | "detached" | "visible" | "hidden";
    timeout: number;
};

export default class Elementutil {

    page: any;

    constructor(page: any) {
        this.page = page;
    }

    // Waits for an element to be visible.
    async waitForElementToBeVisible(element: string): Promise<void> {
        return this.performAction(element, async (locator) => { }, { state: "visible", timeout: 60 * 1000 });
    }

    // Waits for an element to be attached to the DOM.
    async waitForElementToBeAttached(element: string): Promise<void> {
        return this.performAction(element, async (locator) => { }, { state: "attached", timeout: 60 * 1000 });
    }

    // Waits for an element to be hidden.
    async waitForElementToHidden(element: string): Promise<void> {
        let result;
        try {
            result = await this.page.waitForSelector(element, { state: "detached", timeout: 45000 });
        } catch (error) {
            console.error(`Error waiting for element to be hidden: ${element}`, error);
        } finally {
            if (!result) {
                throw { name: "ElementNotFoundError", message: `The Element ${element} was not hidden in the given time` };
            }
        }
        console.log(`Completed waiting for element: ${element}`);
        return result;
    }

    // Performs an action on an element after waiting for a specified state.
    async performAction(element: any, action: (locator: any) => Promise<void>, options: WaitForOptions = { state: "visible", timeout: 60 * 1000 }): Promise<void> {
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
            const locatorState = await locator.evaluate((el: HTMLElement, state: any) => (el as any)[state], state);
            return locatorState;
        } catch (error) {
            console.error(`Error checking element state '${state}' for: ${element}`, error);
            return false;
        }
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

    // Locates an element by its role and name.
    async getByRole(elementRole: string, elementName: string): Promise<any> {
        try {
            return this.page.getByRole(elementRole, { name: elementName });
        } catch (error) {
            console.error(`Error locating the element by Role`, error);
            throw error;
        }
    }

    // Retrieves an attribute of an element.
    async getAttribute(attributeName: string, options: WaitForOptions = { state: "visible", timeout: 60 * 1000 }): Promise<any> {
        try {
            return this.page.getAttribute(attributeName, options);
        } catch (error) {
            console.error(`Error retrieving the element attribute`, error);
            throw error;
        }
    }

    // Locates an element by its alt text.
    async getByAltText(altText: string, options: { exact: true }): Promise<any> {
        try {
            return this.page.getByAltText(altText, options);
        } catch (error) {
            console.error(`Error locating the element by Alt Text`, error);
            throw error;
        }
    }

    // Locates an element by its label text.
    async getByLabel(labelText: string, options: { exact: true }): Promise<any> {
        try {
            return this.page.getByLabel(labelText, options);
        } catch (error) {
            console.error(`Error locating the element by Label`, error);
            throw error;
        }
    }

    // Locates an element by its placeholder text.
    async getByPlaceholder(placeholderText: string, options: { exact: true }): Promise<any> {
        try {
            return this.page.getByPlaceholder(placeholderText, options);
        } catch (error) {
            console.error(`Error locating the element by Placeholder`, error);
            throw error;
        }
    }

    // Retrieves the list of elements matching the selector.
    async getListofElements(element: string): Promise<number> {
        return (await this.page.$$(element)).length;
    }
}