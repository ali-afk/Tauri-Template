import type {
	AppError,
	AppSettings,
	AppSettingsKey,
	Result,
	SettingsPort,
} from "@tauri-template/domain/ports";

import { createSettingsController } from "../settings-controller.js";

/** Builds a SettingsPort test double with vi.fn() methods. */
function makeSettingsPort(): SettingsPort {
	return {
		readSettings: vi.fn(),
		readSettingsField: vi.fn(),
		writeSettings: vi.fn(),
		writeSettingsField: vi.fn(),
	};
}

const settings: AppSettings = {
	theme: "Dark",
	resolution: [1920, 1080],
	fullscreen: false,
};

describe(createSettingsController, () => {
	it("readSettings returns the port result unchanged", async () => {
		// Given: a settings port resolving a known ok result
		const result: Result<AppSettings, AppError> = { status: "ok", data: settings };
		const port = makeSettingsPort();
		vi.mocked(port.readSettings).mockResolvedValue(result);
		const controller = createSettingsController(port);

		// When: the controller's readSettings is called
		const actual = await controller.readSettings();

		// Then: the exact result object passes through
		expect(actual).toBe(result);
	});

	it("readSettingsField delegates with the given key", async () => {
		// Given: a settings port stubbed for the Theme field
		const result: Result<AppSettingsKey, AppError> = { status: "ok", data: { Theme: "Dark" } };
		const port = makeSettingsPort();
		vi.mocked(port.readSettingsField).mockResolvedValue(result);
		const controller = createSettingsController(port);

		// When: readSettingsField is called with a kind identifier
		const actual = await controller.readSettingsField("Theme");

		// Then: the key reaches the port and the result passes through
		expect(actual).toBe(result);
		expect(vi.mocked(port.readSettingsField)).toHaveBeenCalledWith("Theme");
	});

	it("writeSettings delegates with the given settings", async () => {
		// Given: a settings port stubbed for a full write
		const result: Result<null, AppError> = { status: "ok", data: null };
		const port = makeSettingsPort();
		vi.mocked(port.writeSettings).mockResolvedValue(result);
		const controller = createSettingsController(port);

		// When: writeSettings is called with the full settings object
		const actual = await controller.writeSettings(settings);

		// Then: the settings reach the port and the result passes through
		expect(actual).toBe(result);
		expect(vi.mocked(port.writeSettings)).toHaveBeenCalledWith(settings);
	});

	it("writeSettingsField delegates with the given value", async () => {
		// Given: a settings port stubbed for a single-field write
		const result: Result<null, AppError> = { status: "ok", data: null };
		const port = makeSettingsPort();
		vi.mocked(port.writeSettingsField).mockResolvedValue(result);
		const controller = createSettingsController(port);

		// When: writeSettingsField is called with a tagged value
		const actual = await controller.writeSettingsField({ Fullscreen: true });

		// Then: the value reaches the port and the result passes through
		expect(actual).toBe(result);
		expect(vi.mocked(port.writeSettingsField)).toHaveBeenCalledWith({ Fullscreen: true });
	});

	it("readSettings propagates an error result without unwrapping", async () => {
		// Given: a settings port resolving an error result
		const errorResult: Result<AppSettings, AppError> = {
			status: "error",
			error: { type: "Config", data: "store unavailable" },
		};
		const port = makeSettingsPort();
		vi.mocked(port.readSettings).mockResolvedValue(errorResult);
		const controller = createSettingsController(port);

		// When: readSettings is called
		const actual = await controller.readSettings();

		// Then: the error envelope passes through untouched (no throw)
		expect(actual).toBe(errorResult);
	});
});
