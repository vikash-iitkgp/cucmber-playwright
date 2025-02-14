import * as path from 'path';

type WaitForOptions = {

state?: "visible" | "detached" | "attached" | "hidden";

timeout?: number;

};

export default class Interactions {

page: any;

evalstring: string;

constructor (page: any) {
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

}}

// Highlights an element with a custom color.
async trigger(element: string): Promise<void> {
    const locator = this.page.locator(element);
    // await locator.evaluate(el => {
    //     el.style.outline = '2px solid #FDFF47'; // Change 'red' to your desired color
    // });
    await locator.click();
}

async dragAndDrop(source: string, destination: string): Promise<void> {
    await this.page.locator(source).dragTo(this.page.locator(destination));
}

async enterKey(): Promise<void> {
    await this.page.keyboard.press('Enter');
}

async fill(element: string, value: any): Promise<void> {
    return this.performAction(element, async (locator) => await locator.fill(value));
}

async onHover(element: string): Promise<void> {
    return this.performAction(element, async (locator) => locator.hover());
}


async onDoubleClick(element: string): Promise<void> {
    return this.performAction(element, async (locator) => locator.dblclick());
}


async alertAccept(): Promise<void> {
    await this.page.once('dialog', async (dialog) => {
        await dialog.accept();
    });
}

async takeScreenshot(selector: string, path: string): Promise<void> {
    try {
        const element = await this.page.locator(selector);
        await element.screenshot({ path });
    } catch (error) {
        console.error('Error in takeScreenshot:', error);
    }
}
    async takeFullScreenShot(): Promise<void> {
        try {
            await this.page.screenshot({ path: 'fullpage_screenshot.png', fullPage: true });
        } catch (error) {
            console.error('Error in takeFullScreenShot:', error);
        }
    }

    async checkCheckbox(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).check();
        } catch (error) {
            console.error('Error in checkCheckbox:', error);
        }
    }

    async uncheckCheckbox(selector: string): Promise<void> {
        try {
            await this.page.locator(selector).uncheck();
        } catch (error) {
            console.error('Error in uncheckCheckbox:', error);
        }
    }

    async uploadFile(selector: string, filePath: string): Promise<void> {
        try {
            await this.page.locator(selector).setInputFiles(filePath);
        } catch (error) {
            console.error('Error in uploadFile:', error);
        }
    }

    async uploadFile2(element: string, filePath: string): Promise<void> {
        try {
            const [fileChooser] = await Promise.all([
                this.page.waitForEvent('filechooser'),
                this.page.locator(element).click()
            ]);
            await fileChooser.setFiles(path.join(__dirname, filePath));
            console.log("Upload file saved to");
        } catch (error) {
            console.error('Error in uploadFile2:', error);
        }
    }
}
