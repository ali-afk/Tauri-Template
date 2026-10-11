import { $, browser, expect } from "@wdio/globals";

describe("App launch", () => {
	it("renders the main window once the backend is ready", async () => {
		// Given: the Tauri app was launched by the embedded WebDriver provider
		// When: the frontend finishes initialising and swaps the loading state for the app shell
		await $("main").waitForDisplayed({ timeout: 30_000 });

		// Then: the app shell is visible and the document title names the product
		await expect(browser).toHaveTitle(/Tauri Template/);
	});
});
