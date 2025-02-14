import { Page } from '@playwright/test';
import Elementutil from '../utils/UI-Utils/elements-utils';
import { WindowLoctor } from './locators/alertFrameWindowaLocators';

export class BrowserWindowPage {
    readonly page: Page;
    private utils: Elementutil;

    constructor(page: Page) {
        this.page = page;
        this.utils = new Elementutil(page);
    }

    async navigateToBrowserWindowPage() {
        try {
            await this.utils.performAction(WindowLoctor.alertsFrameWindowsMenu, async (locator) => {
                await locator.click();
            });
            await this.utils.performAction(WindowLoctor.browserWindowsMenu, async (locator) => {
                await locator.click();
            });
        } catch (error) {
            console.error('Error navigating to browser window page:', error);
        }
    }

    async clickNewTabButton() {
        try {
            await this.utils.performAction(WindowLoctor.newTabButton, async (locator) => {
                await locator.click();
            });
        } catch (error) {
            console.error('Error clicking new tab button:', error);
        }
    }

    async openNewTabAndVerifyContent() {
        try {
            const initialPages = await this.page.context().pages();

            await Promise.all([
                this.page.waitForEvent('popup'),
                this.clickNewTabButton()
            ]);

            const newPages = await this.page.context().pages();
            const newPage = newPages.find(p => !initialPages.includes(p));
            if (!newPage) throw new Error('New tab did not open');

            await newPage.waitForLoadState();

            const content = await newPage.textContent('body');
            console.log('New tab content:', content);

            if (!content || !content.includes('This is a sample page')) {
                throw new Error('Content does not match expected text');
            }

            await newPage.close();
        } catch (error) {
            console.error('Error opening new tab and verifying content:', error);
        }
    }

    async clicknewWindowButton() {
        try {
            await this.utils.performAction(WindowLoctor.newWindowButton, async (locator) => {
                await locator.click();
            });
        } catch (error) {
            console.error('Error clicking new window button:', error);
        }
    }

    async openNewWindowAndVerifyContent() {
        try {
            const initialPages = await this.page.context().pages();
            await this.clicknewWindowButton();
            await this.page.waitForTimeout(3000); // Allow time for the new window to open

            const newPages = await this.page.context().pages();
            const newWindow = newPages.find(p => !initialPages.includes(p));
            if (!newWindow) throw new Error('New window did not open');

            await newWindow.waitForLoadState();

            const content = await newWindow.textContent('body');
            console.log('New window content:', content);

            if (!content || !content.includes('This is a sample page')) {
                throw new Error('Content does not match expected text');
            }

            await newWindow.close();
        } catch (error) {
            console.error('Error opening new window and verifying content:', error);
        }
    }

    async waitForNewWindow(initialPages: Page[]) {
        try {
            const newPages = await this.page.context().pages();
            const newWindow = newPages.find(p => !initialPages.includes(p));
            if (!newWindow) throw new Error('New window did not open');
            await newWindow.waitForLoadState();
            return newWindow;
        } catch (error) {
            console.error('Error waiting for new window:', error);
            throw error;
        }
    }

    async verifyNewWindowContent(newWindow: Page, expectedContent: string) {
        try {
            const content = await newWindow.textContent('body');
            console.log('New window content:', content);
            if (!content || !content.includes(expectedContent)) {
                throw new Error('Content does not match expected text');
            }
        } catch (error) {
            console.error('Error verifying new window content:', error);
            throw error;
        }
    }

    async openNewWindowAndVerify() {
        try {
            const initialPages = await this.page.context().pages();
            await this.clicknewWindowButton();
            await this.page.waitForTimeout(3000); // Allow time for the new window to open

            const newWindow = await this.waitForNewWindow(initialPages);
            await this.verifyNewWindowContent(newWindow, 'This is a sample page');
            await newWindow.close();
        } catch (error) {
            console.error('Error opening new window and verifying:', error);
        }
    }

    async clickNewMessageButton() {
        try {
            await this.utils.performAction(WindowLoctor.messageWindowButton, async (locator) => {
                await locator.click();
            });
        } catch (error) {
            console.error('Error clicking new message button:', error);
        }
    }

    async waitForNewMessageWindow(initialPages: Page[]) {
        try {
            await this.page.waitForTimeout(3000); // Allow time for the new window to open
            const newPages = await this.page.context().pages();
            const newMessageWindow = newPages.find(p => !initialPages.includes(p));
            if (!newMessageWindow) throw new Error('New message window did not open');
            await newMessageWindow.waitForLoadState('load', { timeout: 45000 });
            return newMessageWindow;
        } catch (error) {
            console.error('Error waiting for new message window:', error);
            throw error;
        }
    }

    async verifyMessageWindowContent(newMessageWindow: Page, expectedContent: string) {
        try {
            const content = await newMessageWindow.evaluate(() => document.body.textContent);
            console.log('New message window content:', content);
            if (!content || !content.includes(expectedContent)) {
                throw new Error('Content does not match expected text');
            }
        } catch (error) {
            console.error('Error verifying message window content:', error);
            throw error;
        }
    }

    async openNewMessageWindowAndVerify() {
        try {
            const initialPages = await this.page.context().pages();
            await this.clickNewMessageButton();
            const newMessageWindow = await this.waitForNewMessageWindow(initialPages);
            await this.verifyMessageWindowContent(newMessageWindow, 'Knowledge increases by sharing but not by saving.');
            await newMessageWindow.close();
        } catch (error) {
            console.error('Error opening new message window and verifying:', error);
        }
    }
}
