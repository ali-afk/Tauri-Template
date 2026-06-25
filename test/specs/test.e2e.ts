import { expect, browser } from "@wdio/globals";

describe("Tauri App", () => {
	it("should launch and display the main window", async () => {
		const title = await browser.getTitle();
		expect(title).toBeDefined();
	});
});