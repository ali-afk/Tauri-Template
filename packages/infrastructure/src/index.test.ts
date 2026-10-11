describe("package entry", () => {
	it("exposes both factory singletons", async () => {
		const entry = await import("./index.js");

		expect(typeof entry.getSettingsService).toBe("function");
		expect(typeof entry.getMetadataService).toBe("function");
	});
});
