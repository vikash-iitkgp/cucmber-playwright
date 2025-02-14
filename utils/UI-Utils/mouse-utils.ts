import { Page } from "playwright-core";
import * as path from "path";

type WaitForOptions = {
  state?: "visible" | "detached" | "attached" | "hidden";

  timeout?: number;
};

export default class Mouse {
  page: Page;

  evalstring: string;

  constructor(page: Page) {
    this.page = page;
  }

  // Handles errors for actions.

  private async handleError(
    action: () => Promise<void>,
    errorMessage: string
  ): Promise<void> {
    try {
      return await action();
    } catch (error) {
      console.error(`${errorMessage}: ${error}`);
    }
  }

  // Drags an element from source to destination.

  async dragAndDrop(source: string, destination: string): Promise<void> {
    try {
      await this.page.locator(source).dragTo(this.page.locator(destination));
    } catch (error) {
      console.error("Error in dragAndDrop:", error);
    }
  }

  // Simulates a key press on an element..

  async keyPress(element: string, keyvalue: string): Promise<void> {
    try {
      await this.page.locator(element).press(keyvalue);
    } catch (error) {
      console.error("Error in keyPress:", error);
    }
  }

  // Performs a right-click on an element.

  async rightClick(element: string): Promise<void> {
    try {
      await this.page.locator(element).click({ button: "right" });
    } catch (error) {
      console.error("Error in rightClick:", error);
    }
  }

  // Scrolls the mouse wheel by the specified x and y amounts.

  async mousewheelscroll(x: number, y: number): Promise<void> {
    try {
      await this.page.mouse.wheel(x, y);
    } catch (error) {
      console.error("Error in mousewheelscroll:", error);
    }
  }

  // Moves the mouse to the specified x and y coordinates.

  async mouseMove(x: number, y: number): Promise<void> {
    try {
      await this.page.mouse.move(x, y);
    } catch (error) {
      console.error("Error in mouseMove:", error);
    }
  }

  // Releases the mouse button.

  async mouseMoveLeft(): Promise<void> {
    try {
      await this.page.mouse.up();
    } catch (error) {
      console.error("Error in mouseMoveLeft:", error);
    }
  }

  // Presses the mouse button.

  async mouseMoveRight(): Promise<void> {
    try {
      await this.page.mouse.down();
    } catch (error) {
      console.error("Error in mouseMoveRight:", error);
    }
  }

  // Downloads a file by clicking an element.

  async downloadFile(element: string): Promise<void> {
    try {
      const [download] = await Promise.all([
        this.page.waitForEvent("download"),
        this.page.locator(element).click(),
      ]);

      await download.saveAs("media/download/" + download.suggestedFilename());

      console.log(
        "Downloaded file saved to 'media/download/'" +
          download.suggestedFilename()
      );
    } catch (error) {
      console.error("Error in downloadFile:", error);
    }
  }

  // Waits for an element to be in a specified state.
  async waitForElement(
    selector: string,
    options?: WaitForOptions
  ): Promise<void> {
    try {
      await this.page.waitForSelector(selector, options || {});
    } catch (error) {
      console.error("Error in waitForElement:", error);
    }
  }
  async getText(selector: string): Promise<string> {
    try {
      return await this.page.locator(selector).innerText();
    } catch (error) {
      console.error("Error in getText:", error);
      return "";
    }
  }

  // Sets the value of an input element.
  async setInputValue(selector: string, value: string): Promise<void> {
    try {
      await this.page.locator(selector).fill(value);
    } catch (error) {
      console.error("Error in setInputValue:", error);
    }
  }

  // Checks if an element is visible.
  async isVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch (error) {
      console.error("Error in isVisible:", error);
      return false;
    }
  }

  // Checks if an element is enabled.
  async isEnabled(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isEnabled();
    } catch (error) {
      console.error("Error in isEnabled:", error);
      return false;
    }
  }
  async takeScreenshot(selector: string, path: string): Promise<void> {
    try {
      const element = await this.page.locator(selector);
      await element.screenshot({ path });
    } catch (error) {
      console.error("Error in takeScreenshot:", error);
    }
  }

  // Hovers over an element.

  async hoveroverElement(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).hover();
    } catch (error) {
      console.error("Error in hoveroverElement:", error);
    }
  }

  // Selects an option from a dropdown.

  async selectoption(selector: string, value: string): Promise<void> {
    try {
      await this.page.locator(selector).selectOption(value);
    } catch (error) {
      console.error("Error in selectoption:", error);
    }
  }

  // Gets an attribute of an element.

  async getAttribute(
    selector: string,
    attribute: string
  ): Promise<string | null> {
    try {
      return await this.page.locator(selector).getAttribute(attribute);
    } catch (error) {
      console.error("Error in getAttribute:", error);
      return null;
    }
  }

  async checkcheckbox(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).check();
    } catch (error) {
      console.error("Error in checkCheckbox:", error);
    }
  }

  // Unchecks a checkbox.
  async uncheckcheckbox(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).uncheck();
    } catch (error) {
      console.error("Error in uncheckCheckbox:", error);
    }
  }

  // Uploads a file to an input element.
  async uploadFile(selector: string, filePath: string): Promise<void> {
    try {
      await this.page.locator(selector).setInputFiles(filePath);
    } catch (error) {
      console.error("Error in uploadFile:", error);
    }
  }

  // Uploads a file using a file chooser.
  async uploadFile2(element: string, filePath: string): Promise<void> {
    try {
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent("filechooser"),
        this.page.locator(element).click(),
      ]);
      await fileChooser.setFiles(path.join(__dirname, filePath));
      console.log("Upload file saved to");
    } catch (error) {
      console.error("Error in uploadFile2:", error);
    }
  }

  async takeFullScreenShot(): Promise<void> {
    try {
      await this.page.screenshot({
        path: "fullpage_screenshot.png",
        fullPage: true,
      });
    } catch (error) {
      console.error("Error in takescreenshot:", error);
    }
  }
}
