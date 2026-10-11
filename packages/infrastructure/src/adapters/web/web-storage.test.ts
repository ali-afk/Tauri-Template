import { defaultWebStorage } from "./web-storage.js";

describe(defaultWebStorage, () => {
	it("binds the seam to the browser's localStorage", () => {
		expect(defaultWebStorage()).toBe(globalThis.localStorage);
	});
});
