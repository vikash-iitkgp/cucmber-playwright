type WaitForOptions = {
    state?: "visible" | "detached" | "attached" | "hidden";
    timeout?: number;
};

export default class Selector {
    page: any;
    evalstring: string;

    constructor(page: any) {
        this.page = page;
    }

    // Locates an element by its role and name.
    async getByRole(elementRole: string, elementName: string): Promise<any> {
        try {
            return this.page.getByRole(elementRole, { name: elementName });
        } catch (error) {
            console.error("Error locating the element by Role", error);
            throw error;
        }
    }

    // Retrieves an attribute of an element.
    async getAttribute(attributeName: string, options: WaitForOptions = { state: "visible", timeout: 60 * 1000 }): Promise<any> {
        try {
            return this.page.getAttribute(attributeName, options);
        } catch (error) {
            console.error("Error retrieving the element attribute", error);
            throw error;
        }
    }
    async getByAltText(altText: string, options: { exact: true }): Promise<any> {
        try {
            return this.page.getByAltText(altText, options);
        } catch (error) {
            console.error("Error locating the element by Alt Text", error);
            throw error;
        }
    }

    // Locates an element by its label text.
    async getByLabel(labelText: string, options: { exact: true }): Promise<any> {
        try {
            return this.page.getByLabel(labelText, options);
        } catch (error) {
            console.error("Error locating the element by Label", error);
            throw error;
        }
    }

    // Locates an element by its placeholder text.
    async getByPlaceHolder(placeHolderText: string, options: { exact: true }): Promise<any> {
        try {
            return this.page.getByPlaceHolder(placeHolderText, options);
        } catch (error) {
            console.error("Error locating the element by Placeholder", error);
            throw error;
        }
    }
}