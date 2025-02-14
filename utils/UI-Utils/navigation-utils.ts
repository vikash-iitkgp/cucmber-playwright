type WaitForOptions = {

    state?: "visible" | "detached" | "attached" | "hidden";
    
    timeout?: number;
    
    };
    
    export default class Navigation {
    
    page: any;
    
    evalString: string;
    
    constructor (page: any) {
    
    this.page=page;
    
    }
    
    // Performs an action on an element after waiting for a specified state.
    
        async performAction(element: any, action: (locator: any) => Promise<void>, options: WaitForOptions = { state: "visible", timeout: 60 * 10000}): Promise<void> {
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
    
        async gotoURL(url: string): Promise<void> {
            try {
                await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 60 * 10000 });
            } catch (error) {
                console.error(`Error navigating to URL: ${url}`, error);
            }
        }
    
        async navigateTo(link: string): Promise<void> {
            // Navigates to a link by clicking it and waiting for navigation to complete.
            try {
                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                    this.page.click(link)
                ]);
            } catch (error) {
                console.error(`Error navigating to link: ${link}`, error);
            }
        }
    
        // Scrolls an element into view.
        async scrollIntoView(element: string): Promise<void> {
            try {
                const selectElement = await this.page.locator(element);
                await selectElement.scrollIntoView();
            } catch (error) {
                console.error(`Error while scrolling to element: ${element}`, error);
                throw error;
            }
        }
    
        // Scrolls an element into view if needed.
        async scrollIntoViewIfNeeded(element: string, options: WaitForOptions = { state: "visible", timeout: 60 * 10000}): Promise<void> {
            try {
                return this.performAction(element, async (locator) => locator.scrollIntoViewIfNeeded(options));
            } catch (error) {
                console.error(`Error scrolling to the element`, error);
                throw error;
            }
        }
    }