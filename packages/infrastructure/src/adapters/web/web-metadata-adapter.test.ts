import { createWebMetadataService } from "./web-metadata-adapter.js";

const METADATA = {
	version: "2.0.0",
	name: "Tauri Template",
	description: "A desktop app template",
	url: "https://example.com",
	contacts: { email: "hi@example.com", github: "https://github.com/example" },
};

function seedStorage(value: unknown) {
	localStorage.setItem("metadata", JSON.stringify(value));
}

describe(createWebMetadataService, () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("returns stored metadata when present", async () => {
		seedStorage(METADATA);

		const result = await createWebMetadataService().appMetadata();

		expect(result).toEqual({ status: "ok", data: METADATA });
	});

	it("returns a Config error when storage is empty", async () => {
		const result = await createWebMetadataService().appMetadata();

		expect(result).toEqual({
			status: "error",
			error: { type: "Config", data: expect.stringContaining("metadata") },
		});
	});

	it("returns a Config error on corrupt JSON", async () => {
		localStorage.setItem("metadata", "{not json");

		const result = await createWebMetadataService().appMetadata();

		expect(result).toEqual({
			status: "error",
			error: { type: "Config", data: expect.stringContaining("Corrupt") },
		});
	});

	it("returns a Config error when the stored shape is wrong", async () => {
		seedStorage({ version: 2 });

		const result = await createWebMetadataService().appMetadata();

		expect(result.status).toBe("error");
	});
});
