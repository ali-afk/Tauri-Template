import type { AppError, AppMetadata, MetadataPort, Result } from "@tauri-template/domain/ports";

import { createMetadataController } from "../metadata-controller.js";

/** Builds a MetadataPort test double with a vi.fn() method. */
function makeMetadataPort(): MetadataPort {
	return {
		appMetadata: vi.fn(),
	};
}

const metadata: AppMetadata = {
	version: "1.2.3",
	name: "Test App",
	description: "A test app",
	url: "https://example.com",
	contacts: {
		email: "test@example.com",
		github: "https://github.com/test",
	},
};

describe(createMetadataController, () => {
	it("appMetadata returns the port result unchanged", async () => {
		// Given: a metadata port resolving a known ok result
		const result: Result<AppMetadata, AppError> = { status: "ok", data: metadata };
		const port = makeMetadataPort();
		vi.mocked(port.appMetadata).mockResolvedValue(result);
		const controller = createMetadataController(port);

		// When: the controller's appMetadata is called
		const actual = await controller.appMetadata();

		// Then: the exact result object passes through
		expect(actual).toBe(result);
	});

	it("appMetadata propagates an error result without unwrapping", async () => {
		// Given: a metadata port resolving an error result
		const errorResult: Result<AppMetadata, AppError> = {
			status: "error",
			error: { type: "Validation", data: "metadata missing" },
		};
		const port = makeMetadataPort();
		vi.mocked(port.appMetadata).mockResolvedValue(errorResult);
		const controller = createMetadataController(port);

		// When: appMetadata is called
		const actual = await controller.appMetadata();

		// Then: the error envelope passes through untouched (no throw)
		expect(actual).toBe(errorResult);
	});
});
