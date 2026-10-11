import { getMetadataService } from "./metadata-factory.js";

const { NATIVE, WEB } = vi.hoisted(() => ({
	NATIVE: { marker: "native" },
	WEB: { marker: "web" },
}));

vi.mock("../adapters/native/native-metadata-adapter.js", () => ({
	createNativeMetadataService: () => NATIVE,
}));

vi.mock("../adapters/web/web-metadata-adapter.js", () => ({
	createWebMetadataService: () => WEB,
}));

describe(getMetadataService, () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns the native adapter inside a Tauri runtime", async () => {
		vi.stubGlobal("__TAURI_INTERNALS__", {});
		const { getMetadataService: fresh } = await import("./metadata-factory.js");

		expect(fresh()).toBe(NATIVE);
	});

	it("returns the web adapter outside a Tauri runtime", async () => {
		const { getMetadataService: fresh } = await import("./metadata-factory.js");

		expect(fresh()).toBe(WEB);
	});

	it("caches the first choice as a singleton", async () => {
		const { getMetadataService: fresh } = await import("./metadata-factory.js");

		const first = fresh();

		expect(fresh()).toBe(first);
	});

	it("keeps the cached instance when the runtime flag toggles later", async () => {
		const { getMetadataService: fresh } = await import("./metadata-factory.js");

		const first = fresh();
		vi.stubGlobal("__TAURI_INTERNALS__", {});

		expect(fresh()).toBe(first);
		expect(first).toBe(WEB);
	});
});
