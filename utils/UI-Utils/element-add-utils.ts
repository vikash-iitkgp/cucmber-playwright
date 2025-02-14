
export default class Elementutil {

  page: any;

  evalstring: string;

  constructor(page: any) {
	this.page = page;
  }

  // Simulates a key press on an element.
  async keyPress(element: string, keyvalue: string): Promise<void> {
	await this.page.locator(element).keyboard.press(keyvalue);
  }

  // Performs a right-click on an element.
  async rightClick(element: string): Promise<void> {
	await this.page.locator(element).click({ button: "right" });
  }

  // Scrolls the mouse wheel by the specified x and y amounts.
  async mousewheelScroll(x: number, y: number): Promise<void> {
	await this.page.mouse.wheel(x, y);
  }

  // Moves the mouse to the specified x and y coordinates.
  async mouseMove(x: number, y: number): Promise<void> {
	await this.page.mouse.move(x, y);
  }

  // Releases the mouse button.
  async mouseMoveLeft(): Promise<void> {
	await this.page.mouse.up();
  }

  // Presses the mouse button.
  async mouseMoveRight(): Promise<void> {
	await this.page.mouse.down();
  }
}
