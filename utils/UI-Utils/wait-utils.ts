type WaitForOptions = {
    state: "attached" | "detached" | "visible" | "hidden";
    timeout: number;
};

export default class Wait {
    page: any;
    evalstring: string;

    constructor(page: any) {
        this.page = page;
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

    // Waits for an element to be visible.
    async waitForElementToBeVisible(element: string): Promise<void> {
        return this.performAction(element, async (locator) => {}, { state: "visible", timeout: 60 * 1000 });
    }

    // Waits for an element to be hidden.
    async waitForElementToHidden(element: string): Promise<void> {
        let result;
        try {
            result = await this.page.waitForSelector(element, { state: "detached", timeout: 45000 });
        } catch (error) {
            console.error(`Error waiting for element to be hidden: ${element}`, error);
            throw { name: "ElementNotFoundError", message: `The Element ${element} was not hidden in the given time` };
        } finally {
            console.log(`Completed waiting for element: ${element}`);
        }
        return result;
    }
}