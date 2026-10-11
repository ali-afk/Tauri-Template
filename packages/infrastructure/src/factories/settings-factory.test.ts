import { getSettingsService } from "./settings-factory.js";

const { NATIVE, WEB } = vi.hoisted(() => ({
	NATIVE: { marker: "native" },
	WEB: { marker: "web" },
}));

vi.mock("../adapters/native/native-settings-adapter.js", () => ({
	createNativeSettingsService: () => NATIVE,
}));

vi.mock("../adapters/web/web-settings-adapter.js", () => ({
	createWebSettingsService: () => WEB,
}));

describe(getSettingsService, () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns the native adapter inside a Tauri runtime", async () => {
		vi.stubGlobal("__TAURI_INTERNALS__", {});
		const { getSettingsService: fresh } = await import("./settings-factory.js");

		expect(fresh()).toBe(NATIVE);
	});

	it("returns the web adapter outside a Tauri runtime", async () => {
		const { getSettingsService: fresh } = await import("./settings-factory.js");

		expect(fresh()).toBe(WEB);
	});

	it("caches the first choice as a singleton", async () => {
		const { getSettingsService: fresh } = await import("./settings-factory.js");

		const first = fresh();

		expect(fresh()).toBe(first);
	});

	it("keeps the cached instance when the runtime flag toggles later", async () => {
		const { getSettingsService: fresh } = await import("./settings-factory.js");

		const first = fresh();
		vi.stubGlobal("__TAURI_INTERNALS__", {});

		expect(fresh()).toBe(first);
		expect(first).toBe(WEB);
	});
});
