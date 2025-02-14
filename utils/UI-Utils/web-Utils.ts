import { Page } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';

export default class Webutility {

    constructor(private page: Page) { }

    // Take a screenshot of the page
    async takescreenshot(path: string, fullPage: boolean): Promise<void> {
        await this.page.screenshot({ path, fullPage });
        console.log(`Screenshot saved to ${path}`);
    }

    // Extract all the links (href attributes) from the page
    async extractlinks(): Promise<string[]> {
        const links = await this.page.$$('a');
        const alllinkHrefs = await Promise.all(
            links.map((link) => link.getAttribute('href'))
        );
        const alllinks = alllinkHrefs.filter((href): href is string => href !== null);
        console.log(alllinks);
        writeFileSync('test-data/UI-testdata/extracted-links.json', JSON.stringify(alllinks, null, 2));
        console.log('Links have been saved to extracted-links.json');
        return alllinks;
    }

    // Validate the status of provided URLs and optionally write results to a file
    async validateUrls(urls: string[]): Promise<{ url: string; status: string }[]> {
        const urlStatuses: { url: string; status: string }[] = [];
        for (const url of urls) {
            try {
                const response = await fetch(url);
                const contentType = response.headers.get('content-type') || '';
                const status = response.status;
                if (contentType.includes('application/json')) {
                    const jsonData = await response.json();
                    console.log({ url, status: `Status: ${status} JSON Response: ${JSON.stringify(jsonData)}` });
                    urlStatuses.push({
                        url,
                        status: `Status: ${status} JSON Response: ${JSON.stringify(jsonData)}`
                    });
                } else {
                    console.log({ url, status: `Status: ${status} - Non-JSON Response` });
                    urlStatuses.push({ url, status: `Status: ${status} - Non-JSON Response` });
                }
            } catch (error) {
                console.log({ url, status: `Error: ${(error as Error).message}` });
                urlStatuses.push({ url, status: `Error: ${(error as Error).message}` });
            }
        }
        mkdirSync('test-data/UI-testdata', { recursive: true });
        writeFileSync('test-data/UI-testdata/ValidatedResults.json', JSON.stringify(urlStatuses, null, 2));
        console.log('URL statuses have been saved in "test-data/UI-testdata/ValidatedResults.json"');
        return urlStatuses;
    }

    // Generate locators (CSS & XPath) for all elements on the page
    async generateLocators(): Promise<{ element: string; cssLocator: string; xpathLocator: string }[]> {
        const elements = await this.page.locator('*').elementHandles();
        const locators: { element: string; cssLocator: string; xpathLocator: string }[] = [];
        for (const element of elements) {
            const tagName = await element.evaluate((el: HTMLElement) => el.tagName.toLowerCase());
            const id = await element.getAttribute('id');
            const classes = await element.getAttribute('class');
            const cssLocator = id ? `#${id}` : classes ? `.${classes.split(' ').join('.')}` : tagName;
            const xpathLocator = await element.evaluate((el: HTMLElement) => {
                let path = '';
                while (el) {
                    const index = Array.from(el.parentNode?.children || []).indexOf(el) + 1;
                    path = `/${el.tagName.toLowerCase()}[${index}]` + path;
                    el = el.parentNode as HTMLElement;
                }
                return path;
            });
            locators.push({ element: tagName, cssLocator, xpathLocator });
        }

        writeFileSync('test-data/UI-testdata/generatedSelectors.json', JSON.stringify(locators, null, 2));
        console.log("Locators saved to 'test-data/UI-testdata/generatedSelectors.json'");
        return locators;
    }

    // Generate dynamic locators based on a given XPath and target text
    async generateDynamicLocators(givenLocator: string, desiredText: string): Promise<void> {
        const simplifiedLocator = givenLocator.startsWith('//')
            ? givenLocator.match(/^\/\/(\w+)/)?.[0] ?? givenLocator
            : givenLocator;

        console.log(`Simplified Locator: ${simplifiedLocator}`);

        const potentialElements = this.page.locator(simplifiedLocator);
        const elementCount = await potentialElements.count();

        if (elementCount === 0) {
            console.log(`No elements found with the locator: "${simplifiedLocator}"`);
            return;
        }

        for (let i = 0; i < elementCount; i++) {
            const element = potentialElements.nth(i);
            const elementText = (await element.textContent())?.trim();

            if (elementText === desiredText) {
                const tagName = await element.evaluate((el) => el.tagName.toLowerCase());
                const id = await element.getAttribute('id');
                const classes = await element.getAttribute('class');

                const cssLocators = [
                    ...(id ? [`${tagName}#${id}`] : []),
                    ...(classes ? [`${tagName}${classes.split(' ').map((cls) => `.${cls}`).join('')}`] : []),
                    `${tagName}:has-text("${desiredText}")`,
                ];

                const xpathLocators = [
                    ...(id ? [`//${tagName}[@id="${id}"]`] : []),
                    ...(classes ? [`//${tagName}[${classes.split(' ').map((cls) => `contains(@class, "${cls}")`).join(' and ')}]`] : []),
                    `//${tagName}[text()="${desiredText}"]`,
                    `//${tagName}[contains(text(), "${desiredText}")]`,
                ];

                console.log(`Generated Locators for Element ${i + 1}:`);
                console.log(' CSS Locators:', cssLocators);
                console.log(' XPath Locators:', xpathLocators);

                return;
            }
        }

        await this.page.pause();
        console.log(`No element with the exact text "${desiredText}" was found.`);
    }
}