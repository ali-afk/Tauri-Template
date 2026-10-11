import type { SettingsPort } from "@tauri-template/domain/ports";

import { createWebSettingsService } from "./web-settings-adapter.js";
import type { WebStorage } from "./web-storage.js";

/** Fixture types derived from the port contract — the web adapter test
 *  asserts the SettingsPort surface, never the raw bindings module. */
type AppSettings = Parameters<SettingsPort["writeSettings"]>[0];
type AppSettingsKey = Parameters<SettingsPort["writeSettingsField"]>[0];
type AppSettingsKeyKind = Parameters<SettingsPort["readSettingsField"]>[0];

const SETTINGS: AppSettings = { theme: "Dark", resolution: [1920, 1080], fullscreen: false };

const FAILING_STORAGE: WebStorage = {
	getItem: () => null,
	setItem: () => {
		throw new Error("quota exceeded");
	},
};

function seedStorage(value: unknown) {
	localStorage.setItem("settings", JSON.stringify(value));
}

describe(createWebSettingsService, () => {
	beforeEach(() => {
		localStorage.clear();
	});

	describe("readSettings", () => {
		it("returns stored settings when present", async () => {
			seedStorage(SETTINGS);

			const result = await createWebSettingsService().readSettings();

			expect(result).toEqual({ status: "ok", data: SETTINGS });
		});

		it("returns a Config error when storage is empty", async () => {
			const result = await createWebSettingsService().readSettings();

			expect(result).toEqual({
				status: "error",
				error: { type: "Config", data: expect.stringContaining("settings") },
			});
		});

		it("returns a Config error on corrupt JSON", async () => {
			localStorage.setItem("settings", "{not json");

			const result = await createWebSettingsService().readSettings();

			expect(result).toEqual({
				status: "error",
				error: { type: "Config", data: expect.stringContaining("Corrupt") },
			});
		});

		it("returns a Config error when the stored shape is wrong", async () => {
			seedStorage({ theme: 42, resolution: [1920, 1080], fullscreen: false });

			const result = await createWebSettingsService().readSettings();

			expect(result.status).toBe("error");
		});
	});

	describe("writeSettings", () => {
		it("persists settings as JSON matching the AppSettings shape", async () => {
			const result = await createWebSettingsService().writeSettings(SETTINGS);

			expect(result).toEqual({ status: "ok", data: null });
			const raw = localStorage.getItem("settings");
			expect(raw).not.toBeNull();
			expect(JSON.parse(raw ?? "")).toEqual(SETTINGS);
		});

		it("round-trips write then read", async () => {
			const service = createWebSettingsService();

			await service.writeSettings(SETTINGS);

			expect(await service.readSettings()).toEqual({ status: "ok", data: SETTINGS });
		});

		it("returns a Config error when the storage write fails", async () => {
			const result = await createWebSettingsService(FAILING_STORAGE).writeSettings(SETTINGS);

			expect(result).toEqual({
				status: "error",
				error: { type: "Config", data: expect.stringContaining("quota") },
			});
		});
	});

	describe("readSettingsField", () => {
		it.each<{ kind: AppSettingsKeyKind; expected: AppSettingsKey }>([
			{ kind: "Theme", expected: { Theme: "Dark" } },
			{ kind: "Resolution", expected: { Resolution: [1920, 1080] } },
			{ kind: "Fullscreen", expected: { Fullscreen: false } },
		])("reads $kind as a tagged key", async ({ kind, expected }) => {
			seedStorage(SETTINGS);

			const result = await createWebSettingsService().readSettingsField(kind);

			expect(result).toEqual({ status: "ok", data: expected });
		});

		it("returns a Config error when storage is empty", async () => {
			const result = await createWebSettingsService().readSettingsField("Theme");

			expect(result.status).toBe("error");
		});
	});

	describe("writeSettingsField", () => {
		it("merges a single field and preserves the others", async () => {
			seedStorage(SETTINGS);

			const result = await createWebSettingsService().writeSettingsField({ Theme: "Light" });

			expect(result).toEqual({ status: "ok", data: null });
			expect(await createWebSettingsService().readSettings()).toEqual({
				status: "ok",
				data: { theme: "Light", resolution: [1920, 1080], fullscreen: false },
			});
		});

		it.each<{ key: AppSettingsKey }>([
			{ key: { Resolution: [1280, 720] } },
			{ key: { Fullscreen: true } },
		])("merges $key without touching other fields", async ({ key }) => {
			seedStorage(SETTINGS);

			await createWebSettingsService().writeSettingsField(key);

			const read = await createWebSettingsService().readSettings();
			expect(read.status).toBe("ok");
		});

		it("returns a Config error when storage is empty", async () => {
			const result = await createWebSettingsService().writeSettingsField({ Theme: "Light" });

			expect(result.status).toBe("error");
		});
	});
});
